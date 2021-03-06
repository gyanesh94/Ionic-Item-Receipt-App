ionic_app.controller('payment_receipt_controller', function ($scope, $rootScope, $state, $cordovaToast, $cordovaSQLite, get_stock_owner, create_new_payment_receipt, track_event, login_sid, send_error_data) {
    var me = this;

    if (typeof analytics !== "undefined") {
        analytics.trackView("Payment Receipt View");
    }

    $scope.new_payment_receipt_object = {
        quantity: '',
        amount_per_item: '',
        stock_owner: {},
        voucher_id: '',
        transaction_type: 'Refill',
        item: 'FC19',
        customer: ''
    };

    $scope.new_payment_receipt = angular.copy($scope.new_payment_receipt_object);

    $scope.new_payment_receipt_search = {
        stock_owner_search: function (query) {
            filters = {};
            fields = ['name', 'description'];
            return get_stock_owner.live_feed(query, filters, fields);
        },
        confirm_disable: false
    };


    // Log Out Event
    $scope.$on('log_out_event', function (event, args) {
        delete $scope.new_payment_receipt;
        $scope.new_payment_receipt = angular.copy($scope.new_payment_receipt_object);
    });


    // Create Payment Receipt
    me.create_payment_receipt = function () {
        $scope.new_payment_receipt_search.confirm_disable = true;
        now_date = moment().format("YYYY-MM-DD");
        now_time = moment().format("HH:mm:ss");
        qty = $scope.new_payment_receipt.quantity;
        amt_per_item = $scope.new_payment_receipt.amount_per_item;
        total = qty * amt_per_item;
        final_data = {
            stock_owner: $scope.new_payment_receipt.stock_owner.value,
            qty: qty,
            docstatus: 1,
            transaction_type: $scope.new_payment_receipt.transaction_type,
            id: $scope.new_payment_receipt.voucher_id.toString(),
            stock_owner: $scope.new_payment_receipt.stock_owner.value,
            qty: qty,
            amount_per_item: amt_per_item,
            total: total,
            customer: $scope.new_payment_receipt.customer,
            company: "VK Logistics",
            stock_date: now_date,
            posting_date: now_date,
            posting_time: now_time,
            fiscal_year: "2015-16",
            item: $scope.new_payment_receipt.item

        };

        create_new_payment_receipt.create_feed(final_data)
            .success(function (data) {
                var query = "INSERT INTO RECEIPT_DATA (ID, METADATA, VOUCHER_TYPE, UPLOADED) VALUES(?, ?, 'PR', 1)";
                $cordovaSQLite.execute(db, query, [final_data.id, JSON.stringify(final_data)]);
                $scope.new_payment_receipt_search.confirm_disable = false;
                delete $scope.new_payment_receipt;
                $cordovaToast.show("Payment Receipt Uploaded", 'long', 'bottom');
                $scope.new_payment_receipt = angular.copy($scope.new_payment_receipt_object);
                track_event.track('Payment Receipt', 'Confirmed', final_data.id + " " + login_sid.name);
                $state.transitionTo('main.select_receipt');
            })
            .error(function (data) {
                error = "";
                if (data != null) {
                    if ("_server_messages" in data) {
                        error = JSON.parse(data._server_messages);
                        error = error[0];
                    } else {
                        error = "Server Error";
                    }
                }
                $cordovaToast.show(error + " Contact Admin", 'long', 'bottom');
                t_send_error = {};
                t_send_error.NAME = "Payment Receipt " + final_data.id;
                t_send_error.DESCRIPTION = error;
                $scope.new_payment_receipt_search.confirm_disable = false;
                send_error_data.send_data(t_send_error, device);
                track_event.track('Payment Receipt', "Error", error + " " + login_sid.name);
                var query = "INSERT INTO ERROR_LOG (NAME, DESCRIPTION) VALUES(?, ?)";
                $cordovaSQLite.execute(db, query, ["PR Not Send", error]);
            });
    };


    $scope.payment_receipt_next = function () {
        f = 1;
        if (!("value" in $scope.new_payment_receipt.stock_owner)) {
            $cordovaToast.show('Enter Stock Owner', 'short', 'bottom');
            f = 0;
        } else if ($scope.new_payment_receipt.voucher_id == '') {
            $cordovaToast.show('Enter Voucher ID', 'short', 'bottom');
            f = 0;
        } else if ($scope.new_payment_receipt.quantity == '') {
            $cordovaToast.show('Enter quantity', 'short', 'bottom');
            f = 0;
        } else if ($scope.new_payment_receipt.amount_per_item == '') {
            $cordovaToast.show('Enter Amount Per Item', 'short', 'bottom');
            f = 0;
        }
        if (f == 1)
            $state.transitionTo('main.payment_receipt.payment_receipt_acknowledgement');
    };

    $scope.payment_receipt_acknowledgement = function () {
        me.create_payment_receipt();
    }
});