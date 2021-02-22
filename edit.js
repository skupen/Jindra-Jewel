const editableElements = document.querySelectorAll("[data-jewel]");

editableElements.forEach(element => {
    var oSettings = {};
    var sSettings = element.getAttribute("data-jewel");
    if(sSettings !== ""){
        oSettings = JSON.parse(sSettings);
    }

    if(oSettings.allowAdd === true){
    }

    if(oSettings.panelContainer === true){
        element.setAttribute("x-data", "setup()");
        element.setAttribute("x-id", "panel")
    }

    if(oSettings.editableItem === true){
        element.setAttribute("x-data", "edit()");
        element.setAttribute("x-on:click", "{$component('panel').openSettingsPanel(), elToEdit()}");
        element.setAttribute("x-on:click.away", "{ close() }");
    }

});

function edit() {
    return{
        active: false,
        lol: "",

        elToEdit() {   
            this.$component("panel").$refs.panelInput.value = this.$el.innerHTML;
        },

        close() {
            if (this.active) {
                console.log(this.$el.innerHTML);
                this.active = false;
            }
        }
    }
}

function setup() {   
    return {
        isSettingsPanelOpen: false,
        openSettingsPanel() {
            this.isSettingsPanelOpen = true;
            this.$nextTick(() => {
                this.$refs.settingsPanel.focus();
                
            })
        }      
    }
}