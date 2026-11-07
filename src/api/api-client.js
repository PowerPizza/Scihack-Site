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

    async getCompleteAccountInfo() {
        let http_resp = await fetch(this.baseUrl+"/account", {method: "GET", headers: this.getCommonHeaders()});
        return {...(await http_resp.json()), status: http_resp.statusText}
    },

    async updateAccount(data) {
        let http_resp = await fetch(this.baseUrl+"/account", {method: "PUT", body: JSON.stringify(data), headers: this.getCommonHeaders()});
        return {...(await http_resp.json()), status: http_resp.statusText}
    },

    async deleteAccount() {
        let http_resp = await fetch(this.baseUrl+"/account", {method: "DELETE", headers: this.getCommonHeaders()});
        return {...(await http_resp.json()), status: http_resp.statusText}
    },

    async getSkills() {
        let http_resp = await fetch(this.baseUrl+"/skills", {method: "GET", headers: this.getCommonHeaders()});
        return {...(await http_resp.json()), status: http_resp.statusText}
    },

    async getProjects() {
        let http_resp = await fetch(this.baseUrl+"/projects", {method: "GET", headers: this.getCommonHeaders()});
        return {...(await http_resp.json()), status: http_resp.statusText}
    },

    async getProjectCategories() {
        let http_resp = await fetch(this.baseUrl+"/projects/categories", {method: "GET", headers: this.getCommonHeaders()});
        return {...(await http_resp.json()), status: http_resp.statusText}
    },

    async getProjectById(project_id) {
        let http_resp = await fetch(this.baseUrl+`/projects/${project_id}`, {method: "GET", headers: this.getCommonHeaders()});
        return {...(await http_resp.json()), status: http_resp.statusText}
    },

    async getServices() {
        let http_resp = await fetch(this.baseUrl+"/services", {method: "GET", headers: this.getCommonHeaders()});
        return {...(await http_resp.json()), status: http_resp.statusText}
    },

    async getServiceById(service_id) {
        let http_resp = await fetch(this.baseUrl+`/services/${service_id}`, {method: "GET", headers: this.getCommonHeaders()});
        return {...(await http_resp.json()), status: http_resp.statusText}
    },
}

export default apiClient;