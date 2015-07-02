// http error interceptor
ionic_app.factory('myHttpResponseInterceptor', ['$q', '$location', '$cordovaToast',
    function ($q, $location, $cordovaToast) {
        return {
            responseError: function (rejection) {
                var stat = rejection.status;
                var msg = '';
                if (stat == 403)
                    msg = 'Login Required';
                else if (stat == 500)
                    msg = 'Internal Server Error';
                else if (stat == 501)
                    msg = 'Server Error';
                else if (stat == 502)
                    msg = 'Server is Offline';
                else if (stat == 503)
                    msg = 'Server is Overload or down';
                else if (stat == 504)
                    msg = 'Server is Offline';
                if (msg != '')
                    $cordovaToast.show(msg, 'short', 'bottom');
                return $q.reject(rejection);
            }
        }
}]);


//Http Intercpetor to check auth failures for xhr requests
ionic_app.config(['$httpProvider',
    function ($httpProvider) {
        $httpProvider.interceptors.push('myHttpResponseInterceptor');
}]);



// Switch Preffered Language
ionic_app.service('switch_preffered_language', ['$translate', function ($translate) {
    this.translate_language = function (preferred_language) {
        $translate.use(preferred_language);
    };
}]);


// Default Http Header Change
ionic_app.config(function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
});



// Login Authentication
ionic_app.service('login_authentication', ['$http', 'app_settings', function ($http, app_settings) {
    this.login_authenticate = function (usr, pwd) {
        var data = {
            usr: usr,
            pwd: pwd
        };
        var url = app_settings.server_base_url + '/api/method/login?' + $.param(data);
        return $http.post(url);
    };
}]);


// Get Customer Accounts from API
ionic_app.service('get_customer_live', ['$http', '$q', 'app_settings', function ($http, $q, app_settings) {
    this.live_feed = function (query, filters, fields) {
        var snd = {
            txt: query,
            fields: JSON.stringify(fields),
            filters: JSON.stringify(filters),
            doctype: 'Customer',
            cmd: 'frappe.widgets.search.search_link',
            _type: 'POST'
        };
        var promise = $q.defer();
        $http.get(app_settings.server_base_url + '?' + $.param(snd))
            .success(function (data) {
                promise.resolve(data.results);
            });
        return promise.promise;
    };
}]);


// Get Vehicle from API
ionic_app.service('get_vehicle_live', ['$http', '$q', 'app_settings', function ($http, $q, app_settings) {
    this.live_feed = function (query, filters, fields) {
        var snd = {
            txt: query,
            fields: JSON.stringify(fields),
            filters: JSON.stringify(filters),
            doctype: 'Transportation Vehicle',
            cmd: 'frappe.widgets.search.search_link',
            _type: 'POST'
        };
        var promise = $q.defer();
        $http.get(app_settings.server_base_url + '?' + $.param(snd))
            .success(function (data) {
                promise.resolve(data.results);
            });
        return promise.promise;
    };
}]);


// Get Payment Receipt Stock Owner
ionic_app.service('get_stock_owner', ['$http', '$q', 'app_settings', function ($http, $q, app_settings) {
    this.live_feed = function (query, filters, fields) {
        var snd = {
            txt: query,
            fields: JSON.stringify(fields),
            filters: JSON.stringify(filters),
            doctype: 'Sales Person',
            cmd: 'frappe.widgets.search.search_link',
            _type: 'POST'
        };
        var promise = $q.defer();
        $http.get(app_settings.server_base_url + '?' + $.param(snd))
            .success(function (data) {
                promise.resolve(data.results);
            });
        return promise.promise;
    };
}]);


// Create Payment Receipt
ionic_app.service('create_new_payment_receipt', ['$http', 'app_settings', function ($http, app_settings) {
    this.create_feed = function (data) {
        var snd = {
            data: JSON.stringify(data)
        };
        return $http.post(app_settings.server_base_url + '/api/resource/Payment Receipt/', $.param(snd));
    };
}]);


// Create Good Receipt
ionic_app.service('create_new_good_receipt', ['$http', 'app_settings', function ($http, app_settings) {
    this.create_feed = function (data) {
        var snd = {
            data: JSON.stringify(data)
        };
        return $http.post(app_settings.server_base_url + '/api/resource/Goods Receipt', $.param(snd));
    };
}]);


// Send Image
ionic_app.service('send_image', ['$http', 'app_settings', function ($http, app_settings) {
    this.send = function (voucher_id, data, filename, doctype, type) {
        var snd = {
            from_form: '1',
            doctype: doctype,
            docname: voucher_id,
            filename: filename,
            filedata: data,
            client: 'app',
            file_field: type,
            cmd: 'uploadfile',
            _type: 'POST'

        };
        return $http.post(app_settings.server_base_url, $.param(snd));
    };
}]);


ionic_app.service('getFeedMockAccount', ['$http', '$q', function ($http, $q) {
    this.getFeed = function () {
        var feed = {
            "results": [
                {
                    "description": "Ledger",
                    "value": "A K Multimetals Pvt. LTD - AL"
    },
                {
                    "description": "Ledger",
                    "value": "A L COLD FORGE PVT. LTD. - AL"
    },
                {
                    "description": "Ledger",
                    "value": "A P ORGANICS PVT. LTD. - AL"
    },
                {
                    "description": "Ledger",
                    "value": "A R CATERING HOUSE - AL"
    },
                {
                    "description": "Ledger",
                    "value": "A S CATERING HOUSE - AL"
    },
                {
                    "description": "Ledger",
                    "value": "A.P. AUTO INDUSTRIES - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AAR AAR INDUSTRY - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AARTI STEEL LTD. AFD II - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AARTI STEEL LTD. ARC  - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AARTI STEEL LTD. ARC - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AARTI STEEL ROLLING MILLS - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AARTI STRIPS PVT. LTD. - AL"
    }
  ]
        };
        var promise = $q.defer();
        promise.resolve(feed['results']);
        return promise.promise;

    };
}]);


ionic_app.service('getFeedMockVehicle', ['$http', '$q', function ($http, $q) {
    this.getFeed = function () {
        var feed = {
            "results": [
                {
                    "description": "Ledger",
                    "value": "A K Multimetals Pvt. LTD - AL"
    },
                {
                    "description": "Ledger",
                    "value": "A L COLD FORGE PVT. LTD. - AL"
    },
                {
                    "description": "Ledger",
                    "value": "A P ORGANICS PVT. LTD. - AL"
    },
                {
                    "description": "Ledger",
                    "value": "A R CATERING HOUSE - AL"
    },
                {
                    "description": "Ledger",
                    "value": "A S CATERING HOUSE - AL"
    },
                {
                    "description": "Ledger",
                    "value": "A.P. AUTO INDUSTRIES - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AAR AAR INDUSTRY - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AARTI STEEL LTD. AFD II - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AARTI STEEL LTD. ARC  - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AARTI STEEL LTD. ARC - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AARTI STEEL ROLLING MILLS - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AARTI STRIPS PVT. LTD. - AL"
    }
  ]
        };
        var promise = $q.defer();
        promise.resolve(feed['results']);
        return promise.promise;

    };
}]);