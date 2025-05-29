import json
import re


#
def CheckSum731(str):
    p731 = [7,3,1]
    
    lengthStr = len(str)

    sum = 0
    for index in range(lengthStr):
        
        c = str[index]

        i = index % 3
        v = p731[i]

        if '<'==c:
            continue

        if c >= 'A' and c <= 'Z':
            sum = sum + (ord(c) -0x41 + 10)*v
        elif c >= '0' and c <= '9':
            sum = sum + (ord(c) -0x30)*v
        
    return sum % 10

#
def ParseName2(names):
    surnameTmp = ""
    givennameTmp = ""
    namesList = []
    lengthName = len(names)
    for index in range(lengthName,-1,-1):
        if'<' == names[index-1]:
            continue
        else:
            names = names[0:index]
            break
    
    # replace name splitor
    names = names.replace("<"," ")
    splitorIndex = names.find("  ")
    if -1 == splitorIndex:
        surnameTmp = names
    else:
        surnameTmp = names[0:splitorIndex]
        givennameTmp = names[splitorIndex+2:]

    return (surnameTmp,givennameTmp)

#
def Parse3LineMrz(mrzs):
    mrzLine1 = mrzs[0]
    mrzLine2 = mrzs[1]
    mrzLine3 = mrzs[2]

    lengthMRZLine1 = len(mrzLine1)
    lengthMRZLine2 = len(mrzLine2)
    lengthMRZLine3 = len(mrzLine3)

    #
    documentInfo ={}

    # Information
    type = "I<"
    countryCode =""
    surname = ""
    givenname =""
    documentNO = ""
    checkDigOfDocumentNO = ""
    nationality=""
    dateOfBirth = ""
    checkDigOfBirth = ""
    sex = ""
    dateOfExpire = ""
    checkDigOfExpire = ""
    optionalData = ""
    optionalData2 = ""
    checkDigOfOptionData = ""
    checkDigOfTotal = ""
    issueTimes = ""
    checkDigIssueTimes = ""
    
    #Chinese card
    cnName = ""
    cnNameGiveup = ""
    cnNamePinyinGiveup = ""
    centuryOfBirth = ""
    idNoLocal = ""
    issueCode = ""

    #old version
    checkDigCnName = ""
    checkDigLine1 = ""
    checkDigLine2 = ""
    centuryOfExpire = ""

    if 30 == lengthMRZLine1 and 30 == lengthMRZLine2 and 30 == lengthMRZLine3:
        type = mrzLine1[0:2]
        typeFlag = mrzLine1[0:1]

        if "I" == typeFlag: # ID1 
            countryCode = mrzLine1[2:5]
            documentNO = mrzLine1[5:14]
            checkDigOfDocumentNO = mrzLine1[14:15]
            optionalData2 = mrzLine1[15:]
            #
            dateOfBirth = mrzLine2[0:6]
            checkDigOfBirth = mrzLine2[6:7]
            sex = mrzLine2[7:8]
            dateOfExpire = mrzLine2[8:14]
            checkDigOfExpire = mrzLine2[14:15]
            nationality = mrzLine2[15:18]
            optionalData = mrzLine2[18:29]
            checkDigOfTotal = mrzLine2[29:30]
            #
            names = mrzLine3
        elif "C" == typeFlag: # Chinese card
            if "CR" == type :
                documentNO = mrzLine1[2:11]
                checkDigOfDocumentNO = mrzLine1[11:12]
                issueTimes = mrzLine1[12:14]
                checkDigIssueTimes = mrzLine1[14:15]
                dateOfExpire = mrzLine1[15:21]
                checkDigOfExpire = mrzLine1[21:22]
                sex = mrzLine1[22:23]
                dateOfBirth = mrzLine1[23:29]
                checkDigOfBirth = mrzLine1[29:30]
                #
                cnName = mrzLine2[0:16]
                cnNameGiveup = mrzLine2[16:17]
                cnNamePinyinGiveup = mrzLine2[17:18]
                centuryOfBirth = mrzLine2[18:19]
                idNoLocal = mrzLine2[19:29]  # ?
                checkDigOfTotal = mrzLine2[29:30]
                #
                names = mrzLine3[0:26]
                issueCode = mrzLine3[26:30]
                #
            elif "CF" == type :
                documentNO = mrzLine1[2:11]
                checkDigOfDocumentNO = mrzLine1[11:12]
                issueTimes = mrzLine1[12:14]
                checkDigIssueTimes = mrzLine1[14:15]
                dateOfExpire = mrzLine1[15:21]
                checkDigOfExpire = mrzLine1[21:22]
                sex = mrzLine1[22:23]
                dateOfBirth = mrzLine1[23:29]
                checkDigOfBirth = mrzLine1[29:30]
                #
                cnName = mrzLine2[0:12]
                cnName = cnName.replace("<", "")
                cnNameGiveup = mrzLine2[13:13]
                countryCode = mrzLine2[15:18]
                centuryOfBirth = mrzLine2[18:19]
                idNoLocal = mrzLine2[19:29]  # ?
                checkDigOfTotal = mrzLine2[29:30]
                #
                names = mrzLine3[0:26]
                issueCode = mrzLine3[26:30]
                #
            elif "CT" == type: # Taiwan
                documentNO = mrzLine1[2:10]
                checkDigOfDocumentNO = mrzLine1[11:12]
                issueTimes = mrzLine1[12:14]
                checkDigIssueTimes = mrzLine1[14:15]
                dateOfExpire = mrzLine1[15:21]
                checkDigOfExpire = mrzLine1[21:22]
                sex = mrzLine1[22:23]
                dateOfBirth = mrzLine1[23:29]
                checkDigOfBirth = mrzLine1[29:30]
                #
                cnName = mrzLine2[0:16]
                cnNameGiveup = mrzLine2[16:17]
                cnNamePinyinGiveup = mrzLine2[17:18]
                centuryOfBirth = mrzLine2[18:19]
                idNoLocal = mrzLine2[19:29]  # ?
                checkDigOfTotal = mrzLine2[29:30]
                #
                names = mrzLine3[0:26]
                issueCode = mrzLine3[26:30]
            else: #old version
                countryCode = mrzLine1[2:5]
                cnName = mrzLine1[5:25]
                cnNameGiveup = mrzLine1[25:26]
                checkDigCnName = mrzLine1[26:27]
                checkDigLine1 = mrzLine1[29:30]
                #
                dateOfBirth = mrzLine2[0:6]
                checkDigOfBirth = mrzLine2[6:7]
                sex = mrzLine2[7:8]
                dateOfExpire = mrzLine2[8:14]
                checkDigOfExpire = mrzLine2[14:15]
                documentNO = mrzLine2[15:24]
                issueTimes = mrzLine2[24:26]
                checkDigOfDocumentNO = mrzLine2[26:27]
                centuryOfBirth = mrzLine2[27:28]
                centuryOfExpire = mrzLine2[28:29]
                checkDigLine2 = mrzLine2[29:30]
                #
                names = mrzLine3
        #
        surname,givenname = ParseName2(names)
    #
    documentInfo["type"]=type
    documentInfo["surname"]=surname
    documentInfo["givenname"]=givenname
    documentInfo["countryCode"]=countryCode
    documentInfo["documentNO"]=documentNO
    documentInfo["checkDigOfDocumentNO"]=checkDigOfDocumentNO
    documentInfo["nationality"]=nationality
    documentInfo["dateOfBirth"]=dateOfBirth
    documentInfo["checkDigOfBirth"]=checkDigOfBirth
    documentInfo["sex"]=sex
    documentInfo["dateOfExpire"]=dateOfExpire
    documentInfo["checkDigOfExpire"]=checkDigOfExpire
    documentInfo["optionalData"]=optionalData
    documentInfo["checkDigOfOptionData"]=checkDigOfOptionData
    documentInfo["checkDigOfTotal"]=checkDigOfTotal

    documentInfo["optionalData2"]=optionalData2
    documentInfo["issueTimes"]=issueTimes
    documentInfo["checkDigIssueTimes"]=checkDigIssueTimes
    documentInfo["cnName"]=cnName
    documentInfo["cnNamePinyinGiveup"]=cnNamePinyinGiveup
    documentInfo["centuryOfBirth"]=centuryOfBirth
    documentInfo["idNoLocal"]=idNoLocal
    documentInfo["issueCode"]=issueCode
    documentInfo["checkDigCnName"]=checkDigCnName
    documentInfo["checkDigLine1"]=checkDigLine1
    documentInfo["checkDigLine2"]=checkDigLine2
    documentInfo["centuryOfExpire"]=centuryOfExpire
    return documentInfo

#
def Parse2LineMrz(mrzs):
    mrzLine1 = mrzs[0]
    mrzLine2 = mrzs[1]

    lengthMRZLine1 = len(mrzLine1) 
    lengthMRZLine2 = len(mrzLine2) 
    #
    documentInfo ={}

    #judge the Passport
    mrzLength = len(mrzLine1)
    type = "P<"
    countryCode =""
    surname = ""
    givenname =""
    documentNO = ""
    checkDigOfDocumentNO = ""
    nationality=""
    dateOfBirth = ""
    checkDigOfBirth = ""
    sex = ""
    dateOfExpire = ""
    checkDigOfExpire = ""
    optionalData = ""
    checkDigOfOptionData = ""
    checkDigOfTotal = ""
    
    #
    if 44 == lengthMRZLine1:
        type = mrzLine1[0:2]
        countryCode = mrzLine1[2:5]
        names = mrzLine1[5:]
        flagType = type[0:1]

        #Passport
        if "P" == flagType:
            #parse mrz second line
            documentNO = mrzLine2[0:9]
            checkDigOfDocumentNO = mrzLine2[9:10]
            nationality = mrzLine2[10:13]
            dateOfBirth = mrzLine2[13:19]
            checkDigOfBirth = mrzLine2[19:20]
            sex = mrzLine2[20:21]
            dateOfExpire = mrzLine2[21:27]
            checkDigOfExpire = mrzLine2[27:28]
            optionalData = mrzLine2[28:42]
            checkDigOfOptionData = mrzLine2[42:43]
            checkDigOfTotal = mrzLine2[43:44]
        elif "V" == flagType:
            #parse mrz second line
            documentNO = mrzLine2[0:9]
            checkDigOfDocumentNO = mrzLine2[9:10]
            nationality = mrzLine2[10:13]
            dateOfBirth = mrzLine2[13:19]
            checkDigOfBirth = mrzLine2[19:20]
            sex = mrzLine2[20:21]
            dateOfExpire = mrzLine2[21:27]
            checkDigOfExpire = mrzLine2[27:28]
            optionalData = mrzLine2[28:42]
            checkDigOfOptionData = mrzLine2[42:43]
            checkDigOfTotal = mrzLine2[43:44]

    elif 36 == lengthMRZLine1: #ID2
        type = mrzLine1[0:2]
        countryCode = mrzLine1[2:5]
        names = mrzLine1[5:]

        flagType = type[0:1]
        #Indenty card
        if "I" == flagType:
            #parse mrz second line
            documentNO = mrzLine2[0:9]
            checkDigOfDocumentNO = mrzLine2[9:10]
            nationality = mrzLine2[10:13]
            dateOfBirth = mrzLine2[13:19]
            checkDigOfBirth = mrzLine2[19:20]
            sex = mrzLine2[20:21]
            dateOfExpire = mrzLine2[21:27]
            checkDigOfExpire = mrzLine2[27:28]
            optionalData = mrzLine2[28:35]
            checkDigOfTotal = mrzLine2[35:36]
        elif "V" == flagType:
            #parse mrz second line
            documentNO = mrzLine2[0:9]
            checkDigOfDocumentNO = mrzLine2[9:10]
            nationality = mrzLine2[10:13]
            dateOfBirth = mrzLine2[13:19]
            checkDigOfBirth = mrzLine2[19:20]
            sex = mrzLine2[20:21]
            dateOfExpire = mrzLine2[21:27]
            checkDigOfExpire = mrzLine2[27:28]
            optionalData = mrzLine2[28:35]
            checkDigOfTotal = mrzLine2[35:36]
    #
    surname,givenname = ParseName2(names)
    
    #
    documentInfo["type"]=type
    documentInfo["surname"]=surname
    documentInfo["givenname"]=givenname
    documentInfo["countryCode"]=countryCode
    documentInfo["documentNO"]=documentNO
    documentInfo["checkDigOfDocumentNO"]=checkDigOfDocumentNO
    documentInfo["nationality"]=nationality
    documentInfo["dateOfBirth"]=dateOfBirth
    documentInfo["checkDigOfBirth"]=checkDigOfBirth
    documentInfo["sex"]=sex
    documentInfo["dateOfExpire"]=dateOfExpire
    documentInfo["checkDigOfExpire"]=checkDigOfExpire
    documentInfo["optionalData"]=optionalData
    documentInfo["checkDigOfOptionData"]=checkDigOfOptionData
    documentInfo["checkDigOfTotal"]=checkDigOfTotal
    return documentInfo
        
        

def Parse1LineMrz(mrzs):
    mrzLine1 = mrzs[0]
    #just the Chinese card

    documentInfo ={}

    mrzLength = len(mrzLine1)
    type = "CS"
    documentNO = ""
    checkDigOfDocumentNO = ""
    dateOfExpire = ""
    checkDigOfExpire = ""
    dateOfBirth = ""
    checkDigOfBirth = ""
    checkDigOfTotal = ""

    #
    if 30 == mrzLength:
        type = mrzLine1[0:2]
        documentNO = mrzLine1[2:11]
        checkDigOfDocumentNO = mrzLine1[11:12]
        dateOfExpire = mrzLine1[13:19]
        checkDigOfExpire = mrzLine1[19:20]
        dateOfBirth = mrzLine1[21:27]
        checkDigOfBirth = mrzLine1[27:28]
        checkDigOfTotal = mrzLine1[29:30]

        #
        documentInfo["type"]=type
        documentInfo["documentNO"]=documentNO
        documentInfo["checkDigOfDocumentNO"]=checkDigOfDocumentNO
        documentInfo["dateOfExpire"]=dateOfExpire
        documentInfo["checkDigOfExpire"]=checkDigOfExpire
        documentInfo["dateOfBirth"]=dateOfBirth
        documentInfo["checkDigOfBirth"]=checkDigOfBirth
        documentInfo["checkDigOfTotal"]=checkDigOfTotal
    return documentInfo

def ParseMRZ( mrzs ):
    try:
        mrzLines = len(mrzs)
        if 3 == mrzLines:
            return Parse3LineMrz(mrzs)
        elif 2 == mrzLines:
            return Parse2LineMrz(mrzs)
        elif 1 == mrzLines:
            return Parse1LineMrz(mrzs)
        else:
            return None
    except Exception as e:
        print(f"解析 MRZ 数据时出错: {e}")
        return None

# test function
if __name__ == "__main__":
    lsMrzs = []
    line = "PASGPNEO<<KENG<BOON<<<<<<<<<<<<<<<<<<<<<<<<<E0520222N2SGP7811089M1210299S7833652H<<<<<94"
    re.sub(r'[^a-zA-Z0-9]', '', line)
    line1 = line[:44]
    line2 = line[44:]
    lsMrzs.append(line1)
    lsMrzs.append(line2)
    documentInfo = ParseMRZ(lsMrzs)
    jsonData = json.dumps(documentInfo)
    print(jsonData)

#HKG & MAC
#CRH1234567830002212119F8108038
#NGKELMPONBPJLBLOAABA1234567842
#ZHENG<JIAN<<YANG<BEN<<<<<<<<<<
#Taiwan
#CDL000000007<2508197<8208031<6
#
#CT00000000<00262006084F8108038
#NGKELMPONBPJLBLOAABR0000000001
#ZHENG<JIAN<<YANG<BEN<<<<<<3500
# Chinese id card old version
#C<CHN327255312289<<<<<<<<01<<6
#9209013F0106164H10101010003120
#LAI<<CHEUK<YI<x<<<<<<<<<<<<<<<
    
# ID1
#I<LVAPA99250101321251<72698<<<<
#8212122F3107210LVA<<<<<<<<<<<<2
#PARAUDZINA<<MARA<<<<<<<<<<<<<<<<

# ID2
#VCD<<MUSTERMANN<<OLGA<<<<<<<<<<<<<<<
#1234567897RUS7409185F1808096<M400630

# ID3
#P<IRNIRANI<<FATEMEH<<<<<<<<<<<<<<<<<<<<<<<<<
#S000028129IRN7902114F1910094<<<<<<<<<<<<<<06
#
#POCHNZHENGJIAN<<YANGBEN<<<<<<<<<<<<<<<<<<<<<
#E000000008CHN8310291F2202059NGKELMPONBPJB972
#
#P<CHNCHUNG<<KWOK<SUM<<<<<<<<<<<<<<<<<<<<<<<<
#K000000000CHN8008080F1702057HK8888888<<<<<34
#
#PDCHNYANG<<ZHAO<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
#DE00000003CHN8509037F2611158NBOONFNB<<<<A912

# /////////////////////ID1/////////////////////////////////
#    mrz1 ="I<LVAPA99250101321251<72698<<<"
#    mrz2 ="8212122F3107210LVA<<<<<<<<<<<2"
#    mrz3 ="PARAUDZINA<<MARA<<<<<<<<<<<<<<"
#    lsMrzs.append(mrz1)
#    lsMrzs.append(mrz2)
#    lsMrzs.append(mrz3)

#////////////////////ID2 Visa////////////////////////////
#    mrz1 = "VCD<<MUSTERMANN<<OLGA<<<<<<<<<<<<<<<"
#    mrz2 = "1234567897RUS7409185F1808096<M400630"
#    lsMrzs.append(mrz1)
#    lsMrzs.append(mrz2)

#////////////////////ID3////////////////////////////
#    mrz1 = "P<IRNIRANI<<FATEMEH<<<<<<<<<<<<<<<<<<<<<<<<<"
#    mrz2 = "S000028129IRN7902114F1910094<<<<<<<<<<<<<<06"
#    lsMrzs.append(mrz1)
#    lsMrzs.append(mrz2)

# /////////////////////ID1 Chinese/////////////////////////////////
#    mrz1 ="CT00000000<00262006084F8108038"
#    mrz2 ="NGKELMPONBPJLBLOAABR0000000001"
#    mrz3 ="ZHENG<JIAN<<YANG<BEN<<<<<<3500"
#    lsMrzs.append(mrz1)
#    lsMrzs.append(mrz2)
#    lsMrzs.append(mrz3)
    
# /////////////////////ID1 Chinese 2/////////////////////////////////
#    mrz1 ="CRH1234567830002212119F8108038"
#    mrz2 ="NGKELMPONBPJLBLOAABA1234567842"
#    mrz3 ="ZHENG<JIAN<<YANG<BEN<<<<<<<<<<"
#    lsMrzs.append(mrz1)
#    lsMrzs.append(mrz2)
#    lsMrzs.append(mrz3)

# /////////////////////ID1 Chinese 3  old version/////////////////////////////////
#    mrz1 ="C<CHN327255312289<<<<<<<<01<<6"
#    mrz2 ="9209013F0106164H10101010003120"
#    mrz3 ="LAI<<CHEUK<YI<<<<<<<<<<<<<<<<<"
#    lsMrzs.append(mrz1)
#    lsMrzs.append(mrz2)
#    lsMrzs.append(mrz3)

# /////////////////////ID1 Chinese 4, 1 Line/////////////////////////////////
#    mrz1 ="CSC000000004<2404200<8108038<6"
#    lsMrzs.append(mrz1)
# /////////////////////ID1 Chinese 5, 1 Line/////////////////////////////////
    #mrz1 ="CDL000000007<2508197<8208031<6"
    #lsMrzs.append(mrz1)

    #


