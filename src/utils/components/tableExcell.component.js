
import { NonIdealState } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import { Cell, Column, Table2 } from "@blueprintjs/table";

export default function TableExcell(props) {
    const {
        // BASIC DATA
        data,
        columns,
        loading,
    } = props
    const { t } = useTranslation();


    const NO_DATA = <div className='p-5'>
        <NonIdealState
            icon={'help'}
            iconSize={44}
            title={"No search results"}
            description={"No data found"}
            layout={'vertical'}

        />
    </div>

    const LOADING = <div class="text-center">
        <div class="spinner-border" role="status">
        </div>
    </div>

    const ROW = (i, c) => <Cell>{c.text(data[i])}</Cell>;

    const COLUMNS = () => (
        columns.map(c => <Column name={c.name} cellRenderer={(i) => ROW(i, c)} />)
    )

    return (<div className='table-container'>
        {!loading ?
            data.length > 0 ?
                <Table2 numRows={data.length}>
                    {COLUMNS()}
                </Table2 >
                : NO_DATA
            : LOADING}
    </div>
    );
}