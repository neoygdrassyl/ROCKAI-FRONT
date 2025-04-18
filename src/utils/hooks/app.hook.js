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

    function cotMontoBase(row) {
        let sum = Number(0);
        sum += Number(row.monto || 0);
        // sum += (row.monto * Number(row.iva || 0)) / 100.0;
        sum += (row.monto * Number(row.adm || 0)) / 100.0;
        sum += (row.monto * Number(row.imp || 0)) / 100.0;
        sum += (row.monto * Number(row.uti || 0)) / 100.0;
        return formatCurrency(sum)
    }

    function cotMontoTotal(row) {
        let sum = Number(0);
        sum += Number(row.monto || 0);
        sum += (row.monto * Number(row.adm || 0)) / 100.0;
        sum += (row.monto * Number(row.imp || 0)) / 100.0;
        sum += (row.monto * Number(row.uti || 0)) / 100.0;
        sum += cotMontoIva(row);
        return formatCurrency(sum)
    }

    function cotMontoIva(row, format = false) {
        let sum = Number(0);
        if (row.uti > 0) sum = (((row.monto * Number(row.uti || 0)) / 100.0) * Number(row.iva || 0)) / 100.0;
        else sum = (row.monto * Number(row.iva || 0)) / 100.0;
        if (format) return formatCurrency(sum);
        return sum
    }


    return { getCityList, formatId, formatNit, formatPhone, formatCurrency, emailPattern, errorHandler, getBanksList, cotMontoBase, cotMontoTotal, cotMontoIva };
};

