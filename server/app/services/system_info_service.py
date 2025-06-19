import re
from fastapi import Request

class SystemInfoService:
    def __init__(self, request: Request):
        self.user_agent = request.headers.get("user-agent", "")

    def get_os(self):
        os_platform = "Unknown OS Platform"
        os_array = {
            r"windows nt 10": "Windows 10",
            r"windows nt 6.3": "Windows 8.1",
            r"windows nt 6.2": "Windows 8",
            r"windows nt 6.1": "Windows 7",
            r"windows nt 6.0": "Windows Vista",
            r"windows nt 5.2": "Windows Server 2003/XP x64",
            r"windows nt 5.1": "Windows XP",
            r"windows xp": "Windows XP",
            r"windows nt 5.0": "Windows 2000",
            r"windows me": "Windows ME",
            r"win98": "Windows 98",
            r"win95": "Windows 95",
            r"win16": "Windows 3.11",
            r"macintosh|mac os x": "Mac OS X",
            r"mac_powerpc": "Mac OS 9",
            r"linux": "Linux",
            r"ubuntu": "Ubuntu",
            r"iphone": "iPhone",
            r"ipod": "iPod",
            r"ipad": "iPad",
            r"android": "Android",
            r"blackberry": "BlackBerry",
            r"webos": "Mobile"
        }

        for pattern, name in os_array.items():
            if re.search(pattern, self.user_agent, re.IGNORECASE):
                os_platform = name
                break

        return os_platform

    def get_browser(self):
        browser = "Unknown Browser"
        browser_array = {
            r"msie": "Internet Explorer",
            r"firefox": "Firefox",
            r"safari": "Safari",
            r"chrome": "Chrome",
            r"edge": "Edge",
            r"opera": "Opera",
            r"netscape": "Netscape",
            r"maxthon": "Maxthon",
            r"konqueror": "Konqueror",
            r"mobile": "Handheld Browser"
        }

        for pattern, name in browser_array.items():
            if re.search(pattern, self.user_agent, re.IGNORECASE):
                browser = name
                break

        return browser
