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

    function formatNit(nit) {
        let text = String(nit);
        if (text.length > 9) return `${nit.substring(0, text.length - 1).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}-${nit.substring(text.length - 1)}`;
        return `${nit.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}-`;
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
        let value = Math.abs(ammount);
        if (ammount < 0) {
            value = new Intl.NumberFormat("es-CO", {
                style: "currency", currency: "COP", maximumFractionDigits: 0
            }
            ).format((value),);
            value = `(${value})`
        }
        else value = new Intl.NumberFormat("es-CO", {
            style: "currency", currency: "COP", maximumFractionDigits: 0
        }
        ).format((value),);
        return value
    }

    const emailPattern = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm;

    function getBanksList() {
        const banks = require('../json/banks.json');
        return banks.map(i => i.nombre_superfinanciera_entidad)
    }

    function errorHandler(error, toast, t) {
        console.error(error);
        toast.dismiss();
        if (error.status === 403) toast.warning(t('auth.nopermit'))
        else toast.error(t('auth.error_generic'))
    }


    return { getCityList, formatId, formatNit, formatPhone, formatCurrency, emailPattern, errorHandler, getBanksList };
};

