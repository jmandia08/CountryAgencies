import * as React from 'react'
import {
    Dropdown, Icon, PrimaryButton,
    Spinner, SpinnerSize, Modal,
    IColumn, DetailsList, DetailsListLayoutMode, SelectionMode
} from '@fluentui/react'

export interface detailsProps {
    details: []
}

const CountryDetails: React.FC<detailsProps> = ({ details }) => {
    const [columns, setColumns] = React.useState<IColumn[]>([
        {
            key: 'country',
            name: 'Country',
            fieldName: 'country',
            minWidth: 10,
            maxWidth: 150,
            isRowHeader: true,
            isResizable: true,
            isSorted: true,
            data: 'string',
            isPadded: true,
        },
        {
            key: 'name',
            name: 'Name',
            fieldName: 'name',
            minWidth: 10,
            maxWidth: 150,
            isRowHeader: true,
            isResizable: true,
            isSorted: true,
            data: 'string',
            isPadded: true,
        },
        {
            key: 'role',
            name: 'Role',
            fieldName: 'role',
            minWidth: 10,
            maxWidth: 150,
            isRowHeader: true,
            isResizable: true,
            isSorted: true,
            data: 'string',
            isPadded: true,
        },
        {
            key: 'contact',
            name: 'Primary Contact',
            fieldName: 'contact',
            minWidth: 10,
            maxWidth: 150,
            isRowHeader: true,
            isResizable: true,
            isSorted: true,
            data: 'string',
            isPadded: true,
        },
    ])

    return (
        <div>
            <DetailsList
                columns={columns}
                items={details}
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
            />
        </div>
    )
}

export default CountryDetails
