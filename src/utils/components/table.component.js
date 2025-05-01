
import { Button, InputGroup, NonIdealState, Tooltip } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import DataTable from 'react-data-table-component';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/auth.context.ts';
import { useLocation } from 'react-router';

export default function TableApp(props) {
    const {
        // BASIC DATA
        data,       // REQUIRED
        columns,    // REQUIRED
        loading,
        title,
        id,

        // ACTIONS
        search,
        btn,
        reload,
        reloadPag,

        // CSV
        csv,
        csvName,
        csvApi,
        csvdata,

        // PAGINATION
        onChangePage,
        onChangeRowsPerPage,
        noPag,

        // STYLES
        conditionalRowStyles,

        //EXPANDABLE ROW
        expand,
        expandDisable,
    } = props
    const { t } = useTranslation();
    const [baseData, setBaseData] = useState(data);
    const [csvData, setCsveData] = useState(csvdata || data);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [field, setField] = useState(null);
    const [filter, setFilter] = useState(null);
    const authContext = useContext(AuthContext)
    const location = useLocation()

    const changePageHandler = (page, totalRows) => {
        setPage(page);
        if (onChangePage) onChangePage(page);
        if (reloadPag && reload) reload(page, size, field, filter);
    }

    const changeRowsPerPageHandler = (size, page) => {
        setSize(size);
        setPage(page);
        if (onChangeRowsPerPage) onChangeRowsPerPage(size);
        if (reloadPag && reload) reload(page, size, field, filter);
    }

    const onReloadHandler = () => {
        if (reloadPag && reload) reload(page, size, field, filter);
        else reload();
    }

    useEffect(() => {
        setBaseData(data);
        setCsveData(csvdata || data);
    }, [data]);


    const PAGINATION_LOCALE = { rowsPerPageText: t('table.rowsPerPageText'), rangeSeparatorText: t('table.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: t('table.selectAllRowsItemText') }

    const NO_DATA = <div className='p-5'>
        <NonIdealState
            icon={'help'}
            iconSize={44}
            title={t('table.nodata')}
            description={t('table.nodatast')}
            layout={'vertical'}

        />
    </div>

    const LOADING = <div class="text-center">
        <div class="spinner-border" role="status">
        </div>
    </div>

    function filter_data() {
        if (reloadPag) {
            if (document.getElementById(`${id}-search-options`).selectedIndex) {
                const value = document.getElementById(`${id}-search-btn`).value;
                const field = document.getElementById(`${id}-search-options`).value;
                setField(field);
                setFilter(value);
                setSize(20);
                setPage(1);
                reload(undefined, undefined, field, value);
            }
            else {
                setField(null);
                setFilter(null);
            }
        }
        else {
            let to_search = document.getElementById(`${id}-search-btn`).value;
            to_search = to_search.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            if (to_search.trim()) {
                let new_data = data.filter(d => {
                    let match = false
                    columns.map(c => {
                        if (c.text && c.text(d)) {
                            let text_to_match = c.text(d).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                            if (text_to_match.includes(to_search)) match = true;
                        }
                    })

                    return match
                });
                setBaseData(new_data);
            }
            else setBaseData(data);
        }

    }

    async function create_csv() {
        let rows = [];
        const headRows = columns.filter(c => !c.omit && !c.omitCsv).map(c => { return c.name })
        if (reloadPag && csvApi) {
            await csvApi(field, filter).then(data => {
                rows = data.map(d =>
                    columns.filter(c => !c.omit && !c.omitCsv).map(c => {
                        if (c.csvText) return (String(c.csvText(d).normalize("NFD").replace(/[\u0300-\u036f]/g, "") ?? '')).replace(/[\n\r]+ */g, ' ')
                        else if (c.text) return (String(c.text(d).normalize("NFD").replace(/[\u0300-\u036f]/g, "") ?? '')).replace(/[\n\r]+ */g, ' ')
                    }));
            })
        } else {
            rows = csvData.map(d =>
                columns.filter(c => !c.omit && !c.omitCsv).map(c => {
                    if (c.csvText) return (String(c.csvText(d).normalize("NFD").replace(/[\u0300-\u036f]/g, "") ?? '')).replace(/[\n\r]+ */g, ' ')
                    else if (c.text) return (String(c.text(d).normalize("NFD").replace(/[\u0300-\u036f]/g, "") ?? '')).replace(/[\n\r]+ */g, ' ')
                }));
        }
        rows.unshift(headRows);
        const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(";")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const fixedEncodedURI = encodedUri.replaceAll('#', '%23').replaceAll('°', 'r');
        const link = document.createElement("a");
        link.setAttribute("href", fixedEncodedURI);
        link.setAttribute("download", `${csvName ? csvName : t('actions.csv_doc_name')}.csv`);
        document.body.appendChild(link);
        link.click();
    }

    return (<div className='table-container'>
        <DataTable
            columns={columns.filter(c => c.text || c.component).map(c => ({
                name: <h5>{c.name}</h5>,
                selector: c.component || c.text,
                omit: c.omit,
                width: c.width
            }))}
            data={baseData}
            title={title}
            noDataComponent={NO_DATA}
            progressPending={loading}
            progressComponent={LOADING}
            highlightOnHover
            pointerOnHover
            dense

            actions={<>
                {csv && csvData.length && authContext.verify(location, "GET") ?
                    <Button intent="success" icon="th" text={t('actions.csv')} onClick={() => create_csv()} />
                    : null}

                {search ? <>
                    {reload
                        ? <Tooltip content={t('actions.reload')} placement="top">
                            <Button icon="repeat" intent='primary' onClick={onReloadHandler} />
                        </Tooltip>
                        : null}
                    {reloadPag
                        ? <div className={`bp5-form-group mt-3 table-select`}>
                            <div className="bp5-form-content">
                                <div className={`bp5-input-group`}>
                                    <span className={`bp5-icon bp5-icon-filter`}></span>
                                    <select id={`${id}-search-options`} className="bp5-select" placeholder={t('table.filter')} dir="auto">
                                        <span className={`bp5-icon bp5-icon-chevron-down`}></span>
                                        <option value={null} disabled selected>{t('table.filter')}</option>
                                        {columns.filter(c => c.value).map(c => <option value={c.value}>{c.name_search || c.name}</option>)}
                                    </select >
                                </div>
                            </div>
                        </div>
                        : null}
                    <InputGroup
                        id={`${id}-search-btn`}
                        placeholder={t('table.search')}
                        size={22}
                        leftIcon="search"
                        rightElement={<Button intent="primary" icon="arrow-right" onClick={() => filter_data()} />}
                        onKeyDown={(event) => { if (event.key === 'Enter') filter_data() }}
                    />
                </> : null}

            </>}

            subHeader
            subHeaderComponent={<>
                {btn}
            </>}
            subHeaderAlign="right"

            pagination={!noPag}
            paginationServer={reloadPag}
            paginationRowsPerPageOptions={[20, 40, 80]}
            paginationTotalRows={reloadPag ? baseData[0]?.n : baseData.length}
            paginationPerPage={size}
            paginationDefaultPage={page}
            onChangeRowsPerPage={changeRowsPerPageHandler}
            onChangePage={changePageHandler}
            paginationComponentOptions={PAGINATION_LOCALE}

            conditionalRowStyles={conditionalRowStyles}

            expandableRows={expand}
            expandableRowsComponent={expand}
            expandableRowDisabled={expandDisable}

        />
    </div>
    );
}