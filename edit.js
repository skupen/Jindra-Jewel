// Helper
function setAttributes(el, attrs) {
    for(var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }

let editableElements = document.querySelectorAll("[data-jewel]");

function dataJewelInit(els) {
    

    els.forEach(element => {
        var oSettings = {};
        var sSettings = element.getAttribute("data-jewel");
        if(sSettings !== ""){
            oSettings = JSON.parse(sSettings);
        }
        setAttributes(element, {
            "x-data": "edit()",
            "data-active": "false",
            "x-on:click": "{$component('panelRef').openSettingsPanel(), elToEdit()}"
        })
                
        if(oSettings.allowAdd === true){
            setAttributes(element, {
                "x-data": "add()",
                "x-on:click": "",
                "x-ref": "ulRef"
            })
    
            if(!element.getAttribute("data-addButtonExists")){
                const addButton = document.createElement("button");
                const buttonSvg = document.createElement("svg");
                const svgPath = document.createElement("path");

                setAttributes(buttonSvg, {
                    "xmlns": "http://www.w3.org/2000/svg",
                    "fill": "none", "viewBox": "0 0 24 24",
                    "stroke": "currentColor"
                });

                setAttributes(addButton, {
                    "x-on:click": "addEl()",
                    "class": "bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full",
                    "x-on:click": "addEl()"
                });
                
                setAttributes(svgPath, {
                    "stroke-linecap": "round", 
                    "stroke-linejoin": "round", 
                    "stroke-width": "2", 
                    "d": "M12 6v6m0 0v6m0-6h6m-6 0H6"
                });

                buttonSvg.appendChild(svgPath);
                addButton.appendChild(buttonSvg);


                element.insertBefore(addButton, element.firstChild);

                element.setAttribute("data-addButtonExists", "true");
                element.setAttribute("x-on:click", "{$component('panelRef').isDeleteButtonVisible = true}");
            }           
        }      
    });
}

dataJewelInit(editableElements);


function edit() {
    return{
        elToEdit() {
            this.$el.setAttribute("data-active", "true");
            this.$component("panelRef").$refs.panelInput.value = this.$el.innerHTML;
        }
    }
}

function add() {
    return{
        addEl() {
            const ul = this.$el
            const templateList= ul.getElementsByTagName("template");
            for (let i = 0; i < templateList.length; i++) {
                const templateContent = templateList[i].content.cloneNode(true);
                this.$refs.ulRef.appendChild(templateContent);
    
                editableElements = document.querySelectorAll(`[data-jewel]`);
                dataJewelInit(editableElements); 
                }
        }
    }
}

function panel() {   
    return {
        isSettingsPanelOpen: false,

        isDeleteButtonVisible: false,

        openSettingsPanel() {
            this.isSettingsPanelOpen = true;
            this.$nextTick(() => {
                this.$refs.settingsPanel.focus();                
            });
        },
        
        save() {
            for (let index = 0; index < editableElements.length; index++) {
                if (editableElements[index].getAttribute("data-active") == "true") {
                    editableElements[index].innerHTML = this.$refs.panelInput.value;
                    editableElements[index].setAttribute("data-active", "false");
                }       
            }
        },

        deleteEl() {
            for (let index = 0; index < editableElements.length; index++) {
                if (editableElements[index].getAttribute("data-active") == "true") {
                        editableElements[index].remove();
                        editableElements = document.querySelectorAll(`[data-jewel]`);
                }       
            }
        }
    }
}