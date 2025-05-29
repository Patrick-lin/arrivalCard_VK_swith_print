import logging
import re
import threading
import socket
import json
from flask import Flask, render_template, request, jsonify

import win32print
import win32ui
import MRZ

# 配置日志记录
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)

def operate_on_2d_array(array):
    """
        定位坐标
    """
    for i in range(len(array)):
        num1, num2 = array[i]
        paper_width_pixels = int(num1 / 25.4 * 600)
        paper_height_pixels = int(num2 / 25.4 * 600)
        # 将运算结果存回数组
        array[i] = [paper_width_pixels, paper_height_pixels]
        logging.info(f"打印坐标：{paper_width_pixels},{paper_height_pixels}")
    return array

def print_file(content, index_array):
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
            paper_width_pixels = int((ind[0] - 4) / 25.4 * 600)
            paper_height_pixels = int((ind[1] - 4) / 25.4 * 600)
            logging.info(f"打印坐标：{paper_width_pixels},{paper_height_pixels}")
            hdc.TextOut(paper_width_pixels, paper_height_pixels, string)
        hdc.EndPage()  # 结束当前页
        hdc.EndDoc()  # 结束打印任务
    finally:
        # 关闭打印机
        win32print.ClosePrinter(hprinter)
        if hdc:  # 只有在 hdc 成功创建时才删除设备上下文
            hdc.DeleteDC()

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
    return userInfo

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
                logging.info(f"连接来自 {addr}")
                if decoded_data.startswith('10'):
                    userInfo = recieve_trans(decoded_data)
                    # 这里可以通过某种方式通知前端，例如使用 Flask 的 SocketIO 扩展
            except Exception as e:
                logging.error(f"数据解析出错: {e}")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/print', methods=['POST'])
def print_info():
    data = request.get_json()
    newUserInfo = f"{data['documentNO']}^{data['nationality']}^{data['surname']}^{data['givenname']}^{data['sex']}^{data['dateOfBirth']}"
    newIndex = [[38, 103], [22, 25], [14, 103], [22, 103], [14, 25], [31, 103]]
    print_file(newUserInfo, newIndex)
    return jsonify({"message": "打印成功"})

@app.route('/parse', methods=['POST'])
def parse_data():
    decoded_data = request.get_json().get('data')
    userInfo = recieve_trans(decoded_data)
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
    return jsonify(result)

if __name__ == "__main__":
    receive_thread = threading.Thread(target=continuous_receive, args=(30008,))
    receive_thread.start()
    app.run(debug=True)