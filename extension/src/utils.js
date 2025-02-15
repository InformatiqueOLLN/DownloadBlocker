var Utils = {
    generateUuid() {
        // https://stackoverflow.com/a/2117523
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/\d/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    },

    notifyUser(title, message){

        var notificationOptions = {
          type: "basic",
          iconUrl: "/icons/icon128.png",
          title: title,
          message: message
        };
        
        chrome.notifications.create(Utils.generateUuid(), notificationOptions);
    },

    getCurrentUrl(){
        return Utils.currentUrl;
    },

    getFileExtension(filename){
        if(!filename.includes(".")){
          return "";
        }
      
        var split = filename.split(".");
        return split[split.length -1].toLowerCase();
    },

    isJsDownload(downloadItem){
        var url = downloadItem.finalUrl.toLowerCase();
        return url.startsWith("data:") || url.startsWith("blob:");
      },

      // https://stackoverflow.com/a/48969580
      XhrRequest(url, method = 'GET', headers = {}, postData = null) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url);

            for(let key in headers){
                xhr.setRequestHeader(key, headers[key]) 
            }

            xhr.onload = function () {
                if (xhr.responseText) {
                    resolve(xhr.responseText);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send(postData);
        });
    },

    parseString(template, downloadItem){
        if(!template){
            return null;
        }
        return template.replaceAll("{fileInspection}", JSON.stringify(downloadItem.fileInspectionData)).replaceAll("{state}", downloadItem.state).replaceAll("{action}", downloadItem.action).replaceAll("{url}", downloadItem.referringPage).replaceAll("{fileUrl}", downloadItem.finalUrl).replaceAll("{filename}", downloadItem.filename).replaceAll("{timestamp}", Date.now()).replaceAll("{sha256}", downloadItem.sha256);

    },

    parseTemplate(postData, downloadItem){

        var data = {};
        
        for(let key in postData){
            data[key] = this.parseString(String(postData[key]), downloadItem);
        }

        return data;
    },

    parseUrl(url, downloadItem){
        return url.replaceAll("{fileInspection}", downloadItem.fileInspectionData).replaceAll("{state}", downloadItem.state).replaceAll("{action}", downloadItem.action).replaceAll("{url}", downloadItem.referringPage).replaceAll("{fileUrl}", encodeURIComponent(downloadItem.finalUrl)).replaceAll("{filename}", encodeURIComponent(downloadItem.filename)).replaceAll("{timestamp}", Date.now()).replaceAll("{sha256}", downloadItem.sha256);
    }
}
