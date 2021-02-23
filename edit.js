let editableElements = document.querySelectorAll("[data-jewel]");

function dataJewelInit(els) {
    

    els.forEach(element => {
        var oSettings = {};
        var sSettings = element.getAttribute("data-jewel");
        if(sSettings !== ""){
            oSettings = JSON.parse(sSettings);
        }
    
        element.setAttribute("x-data", "edit()");
        element.setAttribute("data-active", "false");
        element.setAttribute("x-on:click", "{$component('panel').openSettingsPanel(), elToEdit()}");
    
        if(oSettings.allowAdd === true){
            element.setAttribute("x-data", "add()");
            element.setAttribute("x-on:click", "");
            element.setAttribute("x-ref", "ulRef");
    
            const addButton = document.createElement("button");
            addButton.setAttribute("x-on:click", "alertMsg()");
            addButton.setAttribute("style", "width: 20px; height: 20px; background-color: pink");
            element.appendChild(addButton);
        }
    
    
    });
}

dataJewelInit(editableElements);


function edit() {
    return{
        elToEdit() {
            this.$el.setAttribute("data-active", "true");
            console.log(this.$el.getAttribute("data-active"))
            this.$component("panel").$refs.panelInput.value = this.$el.innerHTML;
        }
    }
}

function add() {
    return{
        alertMsg() {
            var temp = document.getElementsByTagName("template")[0];
            var clon = temp.content.cloneNode(true);
            this.$refs.ulRef.appendChild(clon);
            
            editableElements = document.querySelectorAll("[data-jewel]");
            console.log(editableElements)
            dataJewelInit(editableElements);
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



/*

elementum s data-jewel='{"allowAdd": true}' se vytvori nejaky child button "add"
kliknu na button a tim se vytvori nova polozka dle templatu

*/