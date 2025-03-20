
import { Button, InputGroup, NonIdealState, Tooltip } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import DataTable from 'react-data-table-component';
import { useEffect, useState } from 'react';

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

        // PAGINATION
        onChangePage,
        onChangeRowsPerPage,
        noPag,
    } = props
    const { t } = useTranslation();
    const [baseData, setBaseData] = useState(data);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [field, setField] = useState(null);
    const [filter, setFilter] = useState(null);

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
        setBaseData(data)
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
                reload(page, size, field, value)
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

    return (<div className='table-container'>
        <DataTable
            columns={columns.map(c => ({
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

            actions={search ? <>
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

            subHeader
            subHeaderComponent={btn}
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


        />
    </div>
    );
}