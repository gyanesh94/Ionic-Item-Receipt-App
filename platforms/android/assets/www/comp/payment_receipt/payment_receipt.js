ionic_app.controller('payment_receipt_controller', function ($scope, $state, $cordovaToast, get_stock_owner, create_new_payment_receipt, track_event, login_sid) {
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
        item: 'FC19'
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
            company: "VK Logistics",
            stock_date: now_date,
            posting_date: now_date,
            posting_time: now_time,
            fiscal_year: "2015-16",
            item: $scope.new_payment_receipt.item
        };
        create_new_payment_receipt.create_feed(final_data)
            .success(function (data) {
                $scope.new_payment_receipt_search.confirm_disable = false;
                delete $scope.new_payment_receipt;
                $scope.new_payment_receipt = angular.copy($scope.new_payment_receipt_object);
                track_event.track('Payment Receipt', 'Confirmed', JSON.stringify(final_data) + " " + login_sid.name);
                $state.transitionTo('main.select_receipt');
            })
            .error(function (data) {
                $scope.new_payment_receipt_search.confirm_disable = false;
                if (data._server_messages) {
                    message = JSON.parse(data._server_messages);
                    $cordovaToast.show(message[0], 'short', 'bottom');
                    track_event.track('Payment Receipt', "Error", message[0] + " " + login_sid.name);
                } else {
                    message = "Server Error";
                    $cordovaToast.show(message, 'short', 'bottom');
                    track_event.track('Payment Receipt', "Error", message + " " + login_sid.name);
                }
            });
    };

    $scope.payment_receipt_next = function () {
        $state.transitionTo('main.payment_receipt.payment_receipt_acknowledgement');
    };

    $scope.payment_receipt_acknowledgement = function () {
        me.create_payment_receipt();
    }
});