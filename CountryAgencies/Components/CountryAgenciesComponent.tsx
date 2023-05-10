import {
    Dropdown, Icon, PrimaryButton,
    Spinner, SpinnerSize, Modal,
    IDropdownOption, Label
} from '@fluentui/react'
import * as React from 'react'
import "../Styles/CountryAgencies.scss"
import { getRequest } from '../httpServices/getRequestHttp'
import CountryDetails from './CountryDetails'
export interface IFormData {
    "children": string[];
    "country": string;
    "countryContacts": string[];
    "countryContact": string;
    "iaGroup": object[];
    "eaGroup": object[];
}
const CountryAgenciesComponent = () => {
    const [recordid, setrecordid] = React.useState<any>(getRequest.recordid)
    const [formData, setFormData] = React.useState<IFormData[]>([])
    const [countries, setCountries] = React.useState<any>([])
    const [loadingCountries, setLoadingCountries] = React.useState<any>(false);
    const [loadingChild, setLoadingChild] = React.useState<any>(false);
    const [loading, setLoading] = React.useState<any>(false);
    const [submitting, setSubmitting] = React.useState<any>(false);
    const [detailsShown, setDetailsShown] = React.useState<any>(false);
    const [countryDetail, setCountryDetail] = React.useState<any>([]);

    const addFormdData = () => {
        setDetailsShown(true)
        let existingData: IFormData[] = [...formData];
        existingData.unshift(
            {
                children: [],
                country: "",
                countryContacts: [],
                countryContact: "",
                eaGroup: [
                    {
                        ea: "",
                        eaContact: "",
                        eaContacts: [],
                    }
                ],
                iaGroup: [
                    {
                        ia: "",
                        iaContact: "",
                        iaContacts: [],
                    }
                ]
            }
        )
        setFormData(existingData)
    }

    const removeformData = (index: number) => {
        let existingData: IFormData[] = [...formData];
        existingData.splice(index, 1)
        setFormData(existingData)
    }

    const onRenderOption = (option: any): JSX.Element => {
        return (
            <div className='flag-options'>
                {option.data && option.data.flag && (
                    <img src={option.data.flag} />
                )}
                <span>{option.text}</span>
            </div>
        );
    };

    const onChange = (type: string, item: IDropdownOption<string>, index: number): void => {
        if (item) {
            let existingData = new Array();
            existingData = [...formData]
            existingData[index][type] = item.key;

            if (type == "country") {
                setLoadingChild(true);
                getRequest.getChildCountries(item.key).then((children: any) => {
                    let childrenArr = new Array();
                    children.forEach((country: any) => {
                        childrenArr.push({
                            "key": country.accountid,
                            "text": country.name,
                        })
                    })
                    existingData[index].children = childrenArr
                    setLoadingChild(false);
                })
            }

            if (type == "country" || type == "ea" || type == "ia") {
                let arrayContainer = type == "country" ? "countryContacts" : type == "ea" ? "eaContacts" : "iaContacts"
                setLoading(true);
                getRequest.getContacts(item.key).then((contacts: any) => {
                    let childrenArr = new Array();
                    contacts.forEach((contact: any) => {
                        childrenArr.push({
                            "key": contact.contactid,
                            "text": contact.fullname,
                        })
                    })
                    existingData[index][arrayContainer] = childrenArr;
                    setLoading(false);
                })
            }
            setFormData(existingData)
        }
    };

    const onChangeAgency = (agencyGroup: string, type: string, item: IDropdownOption<string>, index: number, agencyIndex: number): void => {
        if (item) {
            let existingData = new Array();
            existingData = [...formData]
            existingData[index][agencyGroup][agencyIndex][type] = item.key;


            if (type == "ea" || type == "ia") {
                let arrayContainer = type == "ea" ? "eaContacts" : "iaContacts"
                setLoading(true);
                getRequest.getContacts(item.key).then((contacts: any) => {
                    let childrenArr = new Array();
                    contacts.forEach((contact: any) => {
                        childrenArr.push({
                            "key": contact.contactid,
                            "text": contact.fullname,
                        })
                    })
                    existingData[index][agencyGroup][agencyIndex][arrayContainer] = childrenArr;
                    setLoading(false);
                })
            }
            setFormData(existingData)
        }
    };

    const onRenderTitle = (options: any): JSX.Element => {
        const option = options[0];

        return (
            <div className='flag-options'>
                {option.data && option.data.flag && (
                    <img src={option.data.flag} />
                )}
                <span>{option.text}</span>
            </div>
        );
    };

    const submit = () => {
        setSubmitting(true)
        let dataTosave = new Array();
        formData.map((data: any) => {
            dataTosave.push({
                opportunityid: recordid,
                country: data.country,
                countryContact: data.countryContact,
                eaGroup: data.eaGroup,
                iaGroup: data.iaGroup
            })
        })
        console.log("SIR ROMMS ITO PO YUNG BAGONG DATA NA ISSAVE", dataTosave);
        getRequest.saveAgencies(dataTosave).then(data => {
            getRequest.getCountryDetils(recordid).then(data => {
                let countryDetails = new Array();
                data.details.forEach((detail: any) => {
                    if (!detail.role.name.includes("Country")) {
                        countryDetails.push({
                            country: detail.country.name,
                            name: detail.name.name,
                            role: detail.role.name,
                            contact: detail.contact.name,
                        })
                    }
                })
                setCountryDetail(countryDetails)
                setSubmitting(false)
            })
        })
    }

    const addNestedItem = (type: any, index: any) => {
        let existingData = new Array();
        existingData = [...formData]
        existingData[index][type].push(
            type == "eaGroup" ?
                {
                    ea: "",
                    eaContact: "",
                }
                :
                {
                    ia: "",
                    iaContact: "",
                }
        )

        setFormData(existingData);
    }

    const removeNestedItem = (type: any, index: number, nestedIndex: number) => {
        let existingData = new Array();
        existingData = [...formData]
        existingData[index][type].splice(nestedIndex, 1)
        setFormData(existingData);
    }

    React.useEffect(() => {
        setLoadingCountries(true)
        getRequest.getAccessToken().then((token: any) => {
            getRequest.getCountries().then((countries: any) => {
                let countryArray = new Array();
                countries.forEach((country: any) => {
                    countryArray.push({
                        "key": country.id,
                        "text": country.name,
                        "data": {
                            "flag": getRequest.environmentURL + country.cy_defaultimage_url
                        }
                    })
                })
                setCountries(countryArray)
                if (recordid != "") {
                    getRequest.getCountryDetils(recordid).then((data) => {
                        let countryDetails = new Array();
                        let existingData: IFormData[] = [...formData];
                        data.details.forEach((detail: any, index: number) => {

                            if (!detail.role.name.includes("Country")) {
                                countryDetails.push({
                                    country: detail.country.name,
                                    name: detail.name.name,
                                    role: detail.role.name,
                                    contact: detail.contact.name,
                                })
                            }
                        })
                        data.formattedDetails.forEach((detail: IFormData) => {
                            existingData.unshift(detail)
                        })
                        setFormData(existingData);
                        setCountryDetail(countryDetails);
                        setLoadingCountries(false);
                    })
                }
            })
        })
    }, [])
    return (
        recordid != "" ?
            <div className='Main'>
                {!loadingCountries ?
                    countryDetail.length > 0 ?
                        <div className='action-icons'>
                            <div onClick={() => addFormdData()} className='add-button'>
                                <Icon iconName='AddTo' />
                            </div>
                            <div onClick={() => setDetailsShown(!detailsShown)} className='add-button'>
                                <Icon iconName={detailsShown ? 'View' : 'Hide3'} /><h1>Country Details</h1>
                            </div>
                        </div>
                        :
                        <div className='action-icons'>
                            <div onClick={() => addFormdData()} className='add-button'>
                                <Icon iconName='AddTo' /><h1>Add Country Agencies</h1>
                            </div>
                        </div>
                    :
                    <div className='action-icons'>
                        <div className='add-button'>
                            <Spinner size={SpinnerSize.large}></Spinner><h1>Loading Country Agencies</h1>
                        </div>
                    </div>
                }
                <div className='form-container'>
                    {
                        detailsShown ?
                            formData.length > 0 ?
                                formData.map((data: any, index: number) =>
                                    <div className='country-form' key={index}>
                                        <div className='remove-data'><Icon iconName='Delete' onClick={() => removeformData(index)} /></div>
                                        <div className='input-group'>
                                            <Dropdown placeholder="Select country" options={countries}
                                                onRenderTitle={onRenderTitle}
                                                onRenderOption={onRenderOption}
                                                onChange={(e: any, v: any) => onChange("country", v, index)}
                                                label="Country"
                                                selectedKey={data.country}
                                            />
                                            <Dropdown disabled={data.country == ""} onChange={(e: any, v: any) => onChange("countryContact", v, index)} selectedKey={data.countryContact} label="Contact" placeholder={loading ? "Fetching data" : "Select Contact"} options={data.countryContacts} />
                                        </div>
                                        {
                                            data.country != "" ?
                                                <>
                                                    <div onClick={() => addNestedItem("eaGroup", index)} className='add-button'>
                                                        <Label>Executing Agency</Label>
                                                        <Icon iconName='AddTo' />
                                                    </div>
                                                    {
                                                        data.eaGroup.map((ea: any, eaIndex: number) =>
                                                            <div className='input-group'>
                                                                <Dropdown onChange={(e: any, v: any) => onChangeAgency("eaGroup", "ea", v, index, eaIndex)} selectedKey={ea.ea} placeholder={loadingChild ? "Fetching data" : "Select EA"} options={data.children} />
                                                                <Dropdown onChange={(e: any, v: any) => onChangeAgency("eaGroup", "eaContact", v, index, eaIndex)} selectedKey={ea.eaContact} placeholder={loading ? "Fetching data" : "Select Contact"} options={ea.eaContacts} disabled={ea.ea == ""} />
                                                                <Icon iconName='ErrorBadge' onClick={() => removeNestedItem("eaGroup", index, eaIndex)} />
                                                            </div>
                                                        )
                                                    }
                                                    <div onClick={() => addNestedItem("iaGroup", index)} className='add-button'>
                                                        <Label>Implementing Agency</Label>
                                                        <Icon iconName='AddTo' />
                                                    </div>
                                                    {
                                                        data.iaGroup.map((ia: any, iaIndex: number) =>
                                                            <div className='input-group'>
                                                                <Dropdown onChange={(e: any, v: any) => onChangeAgency("iaGroup", "ia", v, index, iaIndex)} selectedKey={ia.ia} placeholder={loadingChild ? "Fetching data" : "Select IA"} options={data.children} />
                                                                <Dropdown onChange={(e: any, v: any) => onChangeAgency("iaGroup", "iaContact", v, index, iaIndex)} selectedKey={ia.iaContact} placeholder={loading ? "Fetching data" : "Select Contact"} options={ia.iaContacts} disabled={ia.ia == ""} />
                                                                <Icon iconName='ErrorBadge' onClick={() => removeNestedItem("iaGroup", index, iaIndex)} />
                                                            </div>
                                                        )
                                                    }
                                                </>
                                                :
                                                <></>

                                        }
                                    </div>
                                )
                                : <></>
                            : <></>
                    }
                </div>
                {detailsShown ? formData.length > 0 ? <PrimaryButton className='submit-form' onClick={submit} text={countryDetail.length > 0 ? 'Update' : 'Save'} /> : <></> : <></>}
                <CountryDetails details={countryDetail} />
                <Modal isOpen={submitting} containerClassName='loader-container'>
                    <div className='loader'>
                        <Spinner size={SpinnerSize.large} />
                        Saving Details
                    </div>
                </Modal>
            </div>
            : <div>Please save opportunity.</div>
    )
}

export default CountryAgenciesComponent
