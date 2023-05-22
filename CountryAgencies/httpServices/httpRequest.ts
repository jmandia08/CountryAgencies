import axios from "axios";


export default class httpRequest {
  public recordid: string;
  public userId: string;
  public userName: string;
  public environmentURL = "https://orgd7bc5443.crm5.dynamics.com/";
  //public environmentURL = "https://flatplanetcrmdev.crm5.dynamics.com/";
  public accessTokenURL = `https://sharepointtokenfn20230413190644.azurewebsites.net/api/GetDataVerseToken?code=ci32nBY7RHZrdpftOt62sIJhjHoCO99rl7HllAejcZ5BAzFutHeSwg==`;//-PROD
  private accessToken: string;

  public async getCountries() {
    const dev = "https://opportunityfn20230417193246.azurewebsites.net/api/QueryAccounts?code=ru0Pe8uGNzIYkDDj9jWzN9O5AfV_8lqw0CppXmXBQ5_yAzFu81EbeQ==";
    // const prd = "https://documentqueryv220220621222506.azurewebsites.net/api/QueryEmployeeFiles?code=P3EP82g_hwZG9AqOxV8lwpbZG6b2fft0uXKvzhp9w-YqAzFuO2kIzg==";
    let url = dev;
    const response = await axios({
      url,
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Prefer": "return=representation"
      },
    });
    return response.data
  }

  public async getChildCountries(id: any) {
    const url = this.environmentURL + `api/data/v9.2/accounts?$filter=_parentaccountid_value eq '${id}'`;

    const response = await axios({
      url,
      method: "GET",
      headers: {
        "Authorization": `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0"
      },

    });
    return response.data.value;
  }
  public async getContacts(id: any) {
    const url = this.environmentURL + `api/data/v9.2/contacts?$filter=_parentcustomerid_value eq '${id}'`;

    const response = await axios({
      url,
      method: "GET",
      headers: {
        "Authorization": `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0"
      },

    });
    return response.data.value;
  }

  public async saveAgencies(dataArr: any) {
    const url = "https://opportunityfn20230417193246.azurewebsites.net/api/LinkOpportunityAccounts?code=z4z05ZVAlvhUnmZD7Eb94sbIKLHic5iW2NOIlDgCiLi_AzFu2W3IxA==";
    const apiResult = await axios({
      url,
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Prefer": "return=representation"
      },
      data: dataArr
    });
    let resuldata = apiResult.data
    return resuldata
  }

  public async getCountryDetails(id: any) {
    const url = `https://opportunityfn20230417193246.azurewebsites.net/api/QueryOpportunityAccountLinks?code=W7XchdqsOibO_pB2vq4GXS_qcIsmuGqi5xDdq3R_7mtUAzFuLIjsfg==&opportunityid=${id}`;

    const response = await axios({
      url,
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Prefer": "return=representation"
      },

    });
    return response.data;
  }

  public async getAccessToken() {
    let url = `https://sharepointtokenfn20230413190644.azurewebsites.net/api/GetDataVerseToken?code=ci32nBY7RHZrdpftOt62sIJhjHoCO99rl7HllAejcZ5BAzFutHeSwg==`;
    const response = await axios({
      url,
      method: "POST",
      headers: {
        Accept: "application/json",
        Prefer: "return=representation",
      },
    });
    this.accessToken = response.data;
    return response.data;
  }

}