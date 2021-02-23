const editableElements = document.querySelectorAll("[data-jewel]");

editableElements.forEach(element => {
    var oSettings = {};
    var sSettings = element.getAttribute("data-jewel");
    if(sSettings !== ""){
        oSettings = JSON.parse(sSettings);
    }

    if(oSettings.allowAdd === true){
        
    }

    element.setAttribute("x-data", "edit()");
    element.setAttribute("data-active", "false");
    element.setAttribute("x-on:click", "{$component('panel').openSettingsPanel(), elToEdit()}");
});

function edit() {
    return{
        elToEdit() {
            this.active = true;
            this.$el.setAttribute("data-active", "true");
            console.log(this.$el.getAttribute("data-active"))
            this.$component("panel").$refs.panelInput.value = this.$el.innerHTML;
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
        },
        
        save() {
            for (let index = 0; index < editableElements.length; index++) {
                    if (editableElements[index].getAttribute("data-active") == "true") {
                        editableElements[index].innerHTML = this.$refs.panelInput.value;
                        editableElements[index].setAttribute("data-active", "false");
                        console.log(editableElements[index].getAttribute("data-active"));
                    }       
            }
        }
    }
}