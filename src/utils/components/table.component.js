
import { Button, InputGroup, NonIdealState } from '@blueprintjs/core';
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

        // ACTIONS
        search,
        btn,

        // PAGINATION
        onChangePage,
        onChangeRowsPerPage,
    } = props
    const { t } = useTranslation();
    const [baseData, setBaseData] = useState(data);

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
        let to_search = document.getElementById("search-btn").value;
        to_search = to_search.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        if(to_search.trim()) {
            let new_data = data.filter(d => {
                let match = false
                columns.map(c => {
                    if(c.text){
                        let text_to_match = c.text(d).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                        if(text_to_match.includes(to_search)) match = true;
                    }
                })

                return match
            });
            setBaseData(new_data);
        }
        else setBaseData(data);
    }

    return (<div className='table-container'>
        <DataTable
            columns={columns.map(c => ({
                name: <h5>{c.name}</h5>,
                selector: c.text || c.component,
            }))}
            data={baseData}
            title={title}
            noDataComponent={NO_DATA}
            progressPending={loading}
            progressComponent={LOADING}
            highlightOnHover
            pointerOnHover
            dense

            actions={search && data.length ? <>
                <InputGroup
                    id="search-btn"
                    placeholder={t('table.search')}
                    size={22}
                    leftIcon="search"
                    rightElement={<Button intent="warning" icon="arrow-right" onClick={() => filter_data()} />}
                    onKeyDown={(event) => { if (event.key == 'Enter') filter_data() }}
                />
            </> : null}

            subHeader
            subHeaderComponent={btn}
            subHeaderAlign="right"

            pagination
            paginationRowsPerPageOptions={[20, 40, 80]}
            paginationPerPage={20}
            paginationComponentOptions={PAGINATION_LOCALE}
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
        />
    </div>
    );
}