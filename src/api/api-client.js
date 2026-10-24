const apiClient = {
    jwt: localStorage.getItem("token") || null,
    baseUrl: "/api/v1",
    getCommonHeaders() {
        return {
            "Authorization": this.jwt ? `Bearer ${this.jwt}` : null,
            "Content-Type": "application/json"
        };
    },

    async getLoginCredentials() {
        let http_resp = await fetch(this.baseUrl+"/auth", {method: "GET", headers: this.getCommonHeaders()});
        return {...(await http_resp.json()), status: http_resp.statusText};
    },

    async login(gmail, password) {
        let http_resp = await fetch(this.baseUrl+"/auth/login", {method: "POST", body: JSON.stringify({gmail, password}), headers: this.getCommonHeaders()});
        return {...(await http_resp.json()), status: http_resp.statusText};
    },

    async checkGmailExists(gmail) {
        let http_resp = await fetch(this.baseUrl+`/auth/gmail_exists?${(new URLSearchParams({gmail})).toString()}`, {method: "GET", headers: this.getCommonHeaders()});
        return {...(await http_resp.json()), status: http_resp.statusText}
    },

    async sendVerificationCode(gmail, code) {
        let http_resp = await fetch(this.baseUrl+`/mail/verification_code`, {method: "POST", body: JSON.stringify({gmail, code}), headers: this.getCommonHeaders()});
        return {...(await http_resp.json()), status: http_resp.statusText}
    },

    async signup(data) {
        let http_resp = await fetch(this.baseUrl+"/auth/signup", {method: "POST", body: JSON.stringify(data), headers: this.getCommonHeaders()});
        return {...(await http_resp.json()), status: http_resp.statusText}
    },
}

export default apiClient;