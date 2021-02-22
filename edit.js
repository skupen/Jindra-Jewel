/*
add event handler document.querySelectorAll("[data-jewel]") for each click event

setAttribute "contentEditable=true"
*/

const editableElements = document.querySelectorAll("[data-jewel]");

editableElements.forEach(element => {
    var oSettings = {};
    var sSettings = element.getAttribute("data-jewel");
    if(sSettings !== ""){
        oSettings = JSON.parse(sSettings);
    }
    if(oSettings.allowAdd === true){
        
    }

    if(oSettings.editorContainer === true){
        element.setAttribute("x-data", "setup()");
    }

    if(oSettings.editableItem === true){
        element.setAttribute("x-data", "{ ...setup(), ...edit() }");
        element.setAttribute("x-on:click", "{ openSettingsPanel() }");
        element.setAttribute("x-on:click.away", "{ close() }");
    }

});

function edit() {
    return{
        active: false,

        open() {
            this.active = true
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
            this.log()
            this.isSettingsPanelOpen = true
            this.log()
            this.$nextTick(() => {
                this.$refs.settingsPanel.focus()
                
            })
        },

        log() {
            console.log(this.isSettingsPanelOpen)
        }
        
    }
}