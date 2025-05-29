import logging
import re
import sys
import threading
import socket
import json
from datetime import time

from flask import Flask, render_template, request, jsonify, send_from_directory
import win32print
import win32ui
import MRZ
import cx_Oracle
import os  # 导入 os 模块

# 将路径替换为你实际解压的目录
os.environ['PATH'] = r'D:\instantclient_19_10;' + os.environ['PATH']

# 配置日志记录
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
JSON_FILE_PATH = 'received_data.json'
PRINT_COUNT_PATH = 'print_count.json'  # 用于存储打印计数的文件

# 从 config.json 文件中读取数据库配置
try:
    with open('config.json', 'r', encoding='utf-8') as f:
        config = json.load(f)
        databases = config.get('databases', [])
except (FileNotFoundError, json.JSONDecodeError):
    logging.error("无法读取 config.json 文件")
    databases = []

# 若未添加此路由，静态文件可能无法正常访问
@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory('images', filename)



# 读取配置文件
def get_config_path(config_filename="config.json"):
    """获取配置文件的路径，支持作为脚本运行和打包为 exe 后的情况"""
    if getattr(sys, 'frozen', False):
        # 如果是打包后的 exe 运行
        base_path = os.path.dirname(sys.executable)
    else:
        # 如果是作为脚本运行
        base_path = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_path, config_filename)

def load_config(config_filename="config.json"):
    """加载配置文件内容"""
    config_path = get_config_path(config_filename)
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"错误：未找到配置文件 {config_path}")
        return None
    except json.JSONDecodeError:
        print(f"错误：配置文件 {config_path} 格式不是有效的 JSON")
        return None
    except Exception as e:
        print(f"错误：加载配置文件时发生未知错误: {e}")
        return None

# 新增路由，用于提供配置信息
@app.route('/get_config', methods=['GET'])
def get_config():
    config = load_config()
    logging.info("配置文件正常加载。。。。")
    return jsonify(config)


# 打印队列有没有任务，如有直接删除并提示缺纸。直接大于0就直接不打印了。
def clear_printer_queue():
    printer_name = win32print.GetDefaultPrinter()
    printdefaults = {"DesiredAccess": win32print.PRINTER_ALL_ACCESS}
    printer_handle = win32print.OpenPrinter(printer_name, printdefaults)
    printer_info = win32print.GetPrinter(printer_handle, 2)
    jobsEnqueue = printer_info['cJobs']
    if jobsEnqueue > 0:
        try:
            jobs = win32print.EnumJobs(printer_handle, 0, -1, 1)
            if jobs is not None:
                for job in jobs:
                    job_id = job['JobId']
                    # 使用 win32print.SetJob 方法并配合 win32print.JOB_CONTROL_DELETE 标志删除作业
                    win32print.SetJob(printer_handle, job_id, 0, None, win32print.JOB_CONTROL_DELETE)
                    logging.info(f"Printer {printer_name} queue has been cleared.")
            # 复位打印机，权限不够
            win32print.SetPrinter(printer_handle, 0, None, win32print.PRINTER_CONTROL_PURGE)
            win32print.ClosePrinter(printer_handle)
            return 0
        except Exception as e:
            logging.info(f"Error clearing printer queue: {e}")
    else:
        return 1


def print_file(content, index_array, next_page_content, next_page_index):
    printer_name = win32print.GetDefaultPrinter()
    logging.info(f"默认打印机: {printer_name}")
    hdc = None  # 初始化 hdc 为 None
    # 打开打印机连接
    hprinter = win32print.OpenPrinter(printer_name)
    try:
        # 创建设备上下文 (Device Context)
        hdc = win32ui.CreateDC()
        hdc.CreatePrinterDC(printer_name)  # 将设备上下文与打印机关联
        hdc.StartDoc("Print Job")  # 开始打印任务

        # 第一页内容
        hdc.StartPage()  # 开始新的一页
        # 设置旋转90度的字体
        font = win32ui.CreateFont({
            "name": "Arial",
            "height": 100,
            "weight": 200,
            "escapement": 900  # 设置字体旋转90度
        })
        hdc.SelectObject(font)
        # 按 ^ 分割字符串为字符串数组
        string_array = content.split('^')
        # 确保 string_array 和 array 长度一致，避免越界
        min_length = min(len(string_array), len(index_array))
        for i in range(min_length):
            ind = index_array[i]
            string = string_array[i]
            # 性别分支
            if i == 4:
                if string == "2":
                    ind[0] = 13
                    ind[1] = 9
                string = "√"
            # 签证分支
            if i == 7 :
                if string == "MQ":
                    ind[0] = 42
                    ind[1] = 10
                    string = "√"
            # 入境事由通知
            if i == 9 :
                    if string == "访问/商务" :
                        ind[0] = 46+4+5
                        ind[1] = 26+2
                    elif string == "旅游":
                        ind[0] = 54+4+5
                        ind[1] = 8+2
                    elif string == "探亲":
                        ind[0] = 62+4+5
                        ind[1] = 46+2
                    elif string == "工作":
                        ind[0] = 54+4+5
                        ind[1] = 46+2
                    elif string == "学习":
                        ind[0] = 54+4+5
                        ind[1] = 26+2
                    elif string == "定居":
                        ind[0] = 46+4+5
                        ind[1] = 8+2
                    elif string == "其他":
                        ind[0] = 62+2+5
                        ind[1] = 8+2
                    elif string == "外交/公务":
                        ind[0] = 46+4+5
                        ind[1] = 46+2
                    string = "√"
            paper_width_pixels = int((ind[0] - 4) / 25.4 * 600)
            paper_height_pixels = int((ind[1] - 4) / 25.4 * 600)

            logging.info(f"打印坐标：{paper_width_pixels},{paper_height_pixels}")
            hdc.TextOut(paper_width_pixels, paper_height_pixels, string)
        hdc.EndPage()  # 结束当前页
        print_config = load_config(config_filename="config.json")
        logging.info(f"打印配置：{print_config}")
        if print_config.get("enableLastFiveRows"):
            # 第二页内容
            hdc.StartPage()  # 开始新的一页
            min_length = min(len(next_page_content), len(next_page_index))
            for i in range(min_length):
                ind = next_page_index[i]
                string = next_page_content[i]
                # 单选框要替换位✔
                if i == 0:
                    if string == "no":
                        ind[0] = 10
                        ind[1] = 140
                    string = "√"
                if i == 3:
                    if string == "no":
                        ind[0] = 32
                        ind[1] = 140
                    string = "√"
                paper_width_pixels = int((ind[0] - 4) / 25.4 * 600)
                paper_height_pixels = int((ind[1] - 4) / 25.4 * 600)
                logging.info(f"第二页打印坐标：{paper_width_pixels},{paper_height_pixels}")
                hdc.TextOut(paper_width_pixels, paper_height_pixels, string)
            hdc.EndPage()  # 结束当前页

        hdc.EndDoc()  # 结束打印任务
    finally:
        # 关闭打印机
        win32print.ClosePrinter(hprinter)
        if hdc:  # 只有在 hdc 成功创建时才删除设备上下文
            hdc.DeleteDC()
    return jsonify({"message": "打印成功"})


def userdata_transform(decoded_data):
    lsMrzs = []
    newCode = re.sub(r'[^A-Z0-9<]', '', decoded_data)
    lastCode = newCode[2:]
    line1 = lastCode[:44]
    line2 = lastCode[44:]
    lsMrzs.append(line1)
    lsMrzs.append(line2)
    logging.info(f"获取到的数据：{lsMrzs}长度：{len(lsMrzs)}")
    userInfo = MRZ.ParseMRZ(lsMrzs)
    surname = userInfo.get('surname')
    givenname = userInfo.get('givenname')
    nationality = userInfo.get('nationality')
    year = int(userInfo.get('dateOfBirth')[:2])
    if year > 25:
        dateOfBirth = "19" + userInfo.get('dateOfBirth')
    else:
        dateOfBirth = "20" + userInfo.get('dateOfBirth')
    sex = userInfo.get('sex')
    if sex == "M":
        sex = "1"
    else:
        sex = "2"
    documentNO = userInfo.get('documentNO')
    newUserInfo = f"{documentNO}^{nationality}^{surname}^{givenname}^{sex}^{dateOfBirth}"
    logging.info(f"用户信息:{newUserInfo}")
    return newUserInfo


def recieve_trans(decoded_data):
    lsMrzs = []
    newCode = re.sub(r'[^A-Z0-9<]', '', decoded_data)
    lastCode = newCode[2:]
    line1 = lastCode[:44]
    line2 = lastCode[44:]
    lsMrzs.append(line1)
    lsMrzs.append(line2)
    logging.info(f"获取到的数据：{lsMrzs}长度：{len(lsMrzs)}")
    userInfo = MRZ.ParseMRZ(lsMrzs)
    year = int(userInfo.get('dateOfBirth')[:2])
    if year > 25:
        newBirthDay = "19" + userInfo.get('dateOfBirth')
    else:
        newBirthDay = "20" + userInfo.get('dateOfBirth')
    result = {
        "documentNO": userInfo.get('documentNO'),
        "surname": userInfo.get('surname'),
        "givenname": userInfo.get('givenname'),
        "nationality": userInfo.get('nationality'),
        "sex": "男 / Male" if userInfo.get('sex') == "M" else "女 / Female",
        "dateOfBirth": newBirthDay
    }
    return result


def continuous_receive(port):
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as server_socket:
        # 设置 SO_REUSEADDR 选项
        server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server_socket.bind(('127.0.0.1', port))
        logging.info(f"开始监听 UDP 端口 {port}")
        while True:
            try:
                data, addr = server_socket.recvfrom(4096)
                decoded_data = data.decode('GBK')
                # logging.info(f"连接来自 {addr}，接收到的数据: {decoded_data}")
                # 解析接收到的数据
                parsed = recieve_trans(decoded_data)
                # 将解析后的数据存储到JSON文件中
                try:
                    with open(JSON_FILE_PATH, 'r', encoding='utf-8') as f:
                        existing_data = json.load(f)
                except (FileNotFoundError, json.JSONDecodeError):
                    existing_data = []
                existing_data.append(parsed)
                with open(JSON_FILE_PATH, 'w', encoding='utf-8') as f:
                    json.dump(existing_data, f, ensure_ascii=False, indent=4)
            except Exception as e:
                logging.error(f"数据解析出错: {e}")

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/print', methods=['POST'])
def print_info():
    data = request.get_json()
    logging.info(f"打印的数据是：{data}")
    newUserInfo = (
        f"{data['documentNO']}^{data['nationality']}^{data['surname']}^{data['givenname']}^{data['sex']}^{data['dateOfBirth']}^{data['chineseName']}^{data['visaNumber']}^{data['arrivalTransport']}"
        f"^{data['entryPurpose']}^{data['phoneNumber']}^{data['citiesInChina']}^{data['addressInChina']}^{data['city']}")
    newIndex = [[38+2, 103], [22+2, 25], [14+2, 103], [22+2, 103], [14+2, 25], [30+2, 103], [30+2, 28], [38+2, 49], [46+2, 88], [46+2, 6],
                [54+2, 88], [62+2, 88], [74+2, 122], [74+2, 33]]

    next_page_content = data.get('nextPageContent', [])
    # 这里调整背面坐标
    next_page_index = [[10, 154], [25, 240], [25, 193], [32, 154], [46, 240], [46, 193], [60, 240]]

    result = print_file(newUserInfo, newIndex, next_page_content, next_page_index)

    # 记录打印次数
    try:
        with open(PRINT_COUNT_PATH, 'r', encoding='utf-8') as f:
            print_count = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        print_count = {"total": 0}

    print_count["total"] += 1

    with open(PRINT_COUNT_PATH, 'w', encoding='utf-8') as f:
        json.dump(print_count, f, ensure_ascii=False, indent=4)

    # 打印完成后清空 JSON 文件
    with open(JSON_FILE_PATH, 'w', encoding='utf-8') as f:
        json.dump([], f)

    insertDatabase(data)

    return jsonify({"message": "打印成功"})


def insertDatabase(data):
    # 插入数据到Oracle数据库
    for db_config in databases:
        try:
            os.environ['NLS_LANG'] = 'SIMPLIFIED CHINESE_CHINA.UTF8'
            dsn = cx_Oracle.makedsn(db_config['DB_HOST'], db_config['DB_PORT'], service_name=db_config['DB_SERVICE_NAME'])
            connection = cx_Oracle.connect(user=db_config['DB_USER'], password=db_config['DB_PASSWORD'], dsn=dsn, encoding="UTF-8",
                                           nencoding="UTF-8")
            cursor = connection.cursor()
            # 新增映射字典
            rjsydm_mapping = {
                # 明确映射项
                "外交/公务": "2",
                "访问/商务": "1",
                "观光/休闲": "3",
                "定居": "7",
                "工作": "5",
                "学习": "6",
                "旅游": "L",
                "探亲": "4",
                "过境": "C",
                "其他": "9"
            }

            # 获取原始入境事由
            entry_purpose = data.get('entryPurpose', '')

            # 执行映射
            rjsydm = rjsydm_mapping.get(entry_purpose, '')  # 未匹配时为空字符串
            if not rjsydm:
                # 若未找到映射，可记录日志或使用默认值（需根据业务需求调整）
                logging.warning(f"未找到入境事由 '{entry_purpose}' 对应的 RJSYDM 映射")
            # 获取当前最大的 YWBH 值
            cursor.execute("SELECT MAX(YWBH) FROM QGTG.BJ_YW_T_WGRRJSBXX WHERE YWBH LIKE 'JC%'")

            max_ywbh = cursor.fetchone()[0]
            if max_ywbh is None:
                seq = 0
            else:
                seq = int(max_ywbh[2:]) + 1
            ywbh = f"JC{str(seq).zfill(6)}"

            logging.info("ywbh is " + ywbh)
            insert_query = """
            INSERT INTO QGTG.BJ_YW_T_WGRRJSBXX (YWBH, YWX, YWM, XBDM, GJDQDM, CSRQ, ZWXM, ZJHM, QZHM, QZZLDM, RJJTBC, RJSYDM, JNDH, MDCSMC, ZHXXZZ, ZHZZXZQH, JHCJRQ, JHCJJTBC, ZFYQDW, ZFYQLXDH, CQWGJDQDM, RKSJ)
            VALUES (:ywbh, :surname, :givenname, :sex, :nationality, :dateOfBirth, utl_raw.cast_to_varchar2(:chineseName), :documentNO, :visaNumber, :visaFree, :arrivalTransport, :entryPurpose, :phoneNumber, utl_raw.cast_to_varchar2(:citiesInChina), utl_raw.cast_to_varchar2(:addressInChina), utl_raw.cast_to_varchar2(:city),  :Dateofdeparture, :DepartureFlightNo, utl_raw.cast_to_varchar2(:NameofChineseinvitingunit), utl_raw.cast_to_varchar2(:AddressoftheChinese), utl_raw.cast_to_varchar2(:countries), 
            TO_CHAR(SYSDATE, 'yyyymmddhh24miss') )
            """

            visa_free = '1' if data.get('visaFree') else '0'

            # 检查值是否为 None，如果是则转换为空字符串
            chineseName = data.get('chineseName') if data.get('chineseName') else ''
            citiesInChina = data.get('citiesInChina') if data.get('citiesInChina') else ''
            addressInChina = data.get('addressInChina') if data.get('addressInChina') else ''
            city = data.get('city') if data.get('city') else ''
            receptionName = data.get('nextPageContent')[4] if data.get('nextPageContent')[4] else ''
            receptionAddress = data.get('nextPageContent')[5] if data.get('nextPageContent')[5] else ''
            pastCountries = data.get('nextPageContent')[6] if data.get('nextPageContent')[6] else ''

            cursor.execute(insert_query, {
                'ywbh': ywbh,
                'surname': data.get('surname'),
                'givenname': data.get('givenname'),
                'sex': 1 if data.get('sex') == "M" else 2,
                'nationality': data.get('nationality'),
                'dateOfBirth': data.get('dateOfBirth'),
                'chineseName': chineseName.encode('GBK'),
                'documentNO': data.get('documentNO'),
                'visaNumber': data.get('visaNumber'),
                'visaFree': visa_free,
                'arrivalTransport': data.get('arrivalTransport'),
                'entryPurpose': rjsydm,
                'phoneNumber': data.get('phoneNumber'),
                'citiesInChina': citiesInChina.encode('GBK'),
                'addressInChina': addressInChina.encode('GBK'),
                'city': city.encode('GBK'),
                # 第二页内容入库
                'Dateofdeparture': data.get('nextPageContent')[1],
                'DepartureFlightNo': data.get('nextPageContent')[2],
                'NameofChineseinvitingunit': receptionName.encode('GBK'),
                'AddressoftheChinese': receptionAddress.encode('GBK'),
                'countries': pastCountries.encode('GBK'),
            })
            connection.commit()
            cursor.close()
            connection.close()
            logging.info(f"数据已成功插入到 {db_config['DB_SERVICE_NAME']} 数据库")
        except Exception as e:
            logging.error(f"插入数据到 {db_config['DB_SERVICE_NAME']} 数据库时出错: {e}")


@app.route('/parse', methods=['POST'])
def parse_data():
    decoded_data = request.get_json().get('data')
    userInfo = recieve_trans(decoded_data)
    return jsonify(userInfo)


@app.route('/get_received_data', methods=['get'])
def get_received_data():
    try:
        with open(JSON_FILE_PATH, 'r', encoding='utf-8') as f:
            existing_data = json.load(f)
            logging.info(f"发送的数据是：{existing_data}")
        if existing_data:
            last_data = existing_data[-1]
            return jsonify({"data": last_data})
    except (FileNotFoundError, json.JSONDecodeError):
        pass
    return jsonify({"data": None})


@app.route('/clear', methods=['GET'])
def clear_info():
    logging.info("用户数据正在正在清空")
    # 清空重采后清空 JSON 文件
    with open(JSON_FILE_PATH, 'w', encoding='utf-8') as f:
        json.dump([], f)
    logging.info("用户数据已清空")
    return jsonify({"message": "清除成功"})


if __name__ == "__main__":
    receive_thread = threading.Thread(target=continuous_receive, args=(30008,))
    receive_thread.start()
    app.run(debug=True)