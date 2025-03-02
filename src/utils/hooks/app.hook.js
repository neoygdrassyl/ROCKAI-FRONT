import colombia from '../json/colombia.json'

export const useApp = () => {


    function getCityList() {
        let cities = [];
        colombia.map(item => {
            cities = [...cities, ...item.ciudades]
        });
        return cities
    }

    function formatId(id) {
        return id.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function formatPhone(phoneNumberString) {
        var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phoneNumberString;
    }

    function formatCurrency(ammount) {
        let value = new Intl.NumberFormat("es-CO", {
            style: "currency", currency: "COP", maximumFractionDigits: 0
        }
        ).format((ammount),);
        return value
    }

    const emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    return { getCityList, formatId, formatPhone, formatCurrency, emailPattern };
};

