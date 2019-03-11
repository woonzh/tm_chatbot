GENERATE_SOURCEMAP=false

PORT=3000
REACT_APP_tokenName=apa-token
REACT_APP_dateformat=d M yy
REACT_APP_emailReg=^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$
REACT_APP_notificationTimeout=5000

REACT_APP_rootUrl=%location.origin%

REACT_APP_apiAppPort=1337
REACT_APP_apiAppPROTOCOL=http
REACT_APP_apiAppHOST=localhost
REACT_APP_apiUrl={apiAppPROTOCOL}://{apiAppHOST}:{apiAppPort}

REACT_APP_configUrl={rootUrl}/data/apps/telekom-malaysia-chatbot.json

REACT_APP_authUrl={apiUrl}/api/v1/auth
REACT_APP_profileUrl={apiUrl}/api/v1/profile
REACT_APP_loginUrl={apiUrl}/api/v1/login
REACT_APP_logoutUrl={apiUrl}/api/v1/logout
REACT_APP_registerUrl={apiUrl}/api/v1/register
REACT_APP_forgotPasswordUrl={apiUrl}/api/v1/forgot_password

REACT_APP_qnaApiUrl=http://localhost:5000/api/query
REACT_APP_telekomMalaysiaChatbotApi=http://localhost:3001

REACT_APP_fileUploadSize=4000000
