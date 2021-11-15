require('dotenv').config();

const button = document.querySelector('.button-primary'),
    orderId = document.getElementById('orderId'),
    date = document.getElementById('date'),
    address = document.getElementById('address'),
    shippingtimefrom = document.getElementById('shippingtimefrom'),
    shippingtimefor = document.getElementById('shippingtimefor'),
    customerName = document.getElementById('customer-name'),
    phoneNumberMain = document.getElementById('phone-number-main'),
    phoneNumberSecondary = document.getElementById('phone-number-secondary'),
    price = document.getElementById('price'),
    assessedValue = document.getElementById('assessed-value'),
    paidCheckbox = document.getElementById('paid-checkbox'),
    returnCheckbox = document.getElementById('return-checkbox'),
    comment = document.getElementById('comment'),
    errorsList = document.getElementById('errors-list');

function sendData() {
    const formdata = new FormData();

    formdata.append(
        'XMLPackage',
        `<File>
        <API>${process.env.GRASTIN_API_KEY}</API>
        <Method>newordercourier</Method>
        <Orders>
            <Order number = "КЕН${orderId.value}"
            address = "${address.value}"
            comment = "${comment.value}"
            shippingtimefrom = "${shippingtimefrom.value}"
            shippingtimefor = "${shippingtimefor.value}"
            shippingdate = "${parseDateFromPicker(date.value)}"
            buyer = "${customerName.value}"
            summa = "${price.value}"
            assessedsumma = "${assessedValue.value}"
            phone1 = "${phoneNumberMain.value}"
            phone2 = "${phoneNumberSecondary.value}"
            service = "${paymenHandler(paidCheckbox, returnCheckbox)}"
            test = "yes"
            seats = "1"
            takewarehouse = "Москва">
            </Order>
        </Orders>
        </File>`
    );
    const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
    };

    fetch('http://api.grastin.ru/api.php', requestOptions)
        .then((response) => response.text())
        .then(responseHandler)
        .catch((error) => console.log('error', error));
}

function paymenHandler(payOrder, returnOrder) {
    if (payOrder.checked) {
        return 1;
    } else if (!payOrder.checked && !returnOrder.checked) {
        return 2;
    } else if (returnOrder.checked) {
        return 924;
    }
}

function responseHandler(response) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(response, 'text/xml');
    let errors = xmlDoc.querySelectorAll('Error');
    errorsList.innerHTML = '';
    if (errors.length < 1) {
        const li = document.createElement('li');
        li.innerText = 'Отправка прошла успешно';
        li.style.color = 'green';
        errorsList.prepend(li);
    } else {
        errors.forEach((error) => {
            const li = document.createElement('li');
            li.innerText = error.textContent;
            li.style.color = 'red';
            errorsList.prepend(li);
        });
    }
}

function parseDateFromPicker(date) {
    return date.split('-').reverse().join('');
}

button.addEventListener('click', function (e) {
    e.preventDefault();
    sendData();
});
