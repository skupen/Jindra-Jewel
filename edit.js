const elData = [];

let responseCounter = 0;

function getEls(id) {
    axios.get(`http://dev.contactifyapp.eu:9110/api/jewel/component/${id}`)
    .then(response => {
        //console.log(response.data);
        elData.push(response.data);
        responseCounter++
        if (responseCounter ===  document.querySelectorAll("[data-id]").length) {
            renderAJAXEl();
        }
    })
}

for (let i = 0; i < document.querySelectorAll("[data-id]").length; i++) {
    getEls(document.querySelectorAll("[data-id]")[i].getAttribute("data-id"));
}

function renderAJAXEl() {
    elData.forEach(element => {
        const elId = element.componentId;
        const el = document.querySelector(`[data-id=${elId}]`);
        const elContent = JSON.parse(element.data).content;

        if (el.tagName == "UL") {
            elContent.forEach(liContent => {
                const li = document.createElement("li")
                const content = document.createTextNode(liContent);
                li.appendChild(content);
                li.setAttribute("data-jewel", "");
                el.appendChild(li);
            });
        }else{
            el.innerHTML = elContent;
        }
    });
    editableElements = document.querySelectorAll("[data-jewel]");
    dataJewelInit(editableElements);
}

function postEls(id, content) {
    axios.post(
        `http://dev.contactifyapp.eu:9110/api/jewel/component/${id}`, 
        {data: JSON.stringify({content: content})}
    )
    .then(response => {
        console.log(response.data);
    })
}

// Helper
function setAttributes(el, attrs) {
    for(var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }

// function ID() {
//     // Math.random should be unique because of its seeding algorithm.
//     // Convert it to base 36 (numbers + letters), and grab the first 9 characters
//     // after the decimal.
//     return '_' + Math.random().toString(36).substr(2, 9);
//   };

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
            "x-on:click": "{$component('panelRef').openSettingsPanel(), elToEdit()}",
        })
        
                
        if(oSettings.allowAdd === true){
            setAttributes(element, {
                "x-data": "add()",
                "x-on:click": "",
                "x-ref": "ulRef",
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
            const ul = this.$el;

            const templateList= ul.getElementsByTagName("template");
            for (let i = 0; i < templateList.length; i++) {
                const templateContent = templateList[i].content.cloneNode(true);
                this.$refs.ulRef.appendChild(templateContent);
    
                editableElements = document.querySelectorAll(`[data-jewel]`);
                dataJewelInit(editableElements); 
                }
            
            let liArray = [];
            for (let i = 0; i < ul.querySelectorAll(`[data-jewel]`).length; i++) {
                liArray.push(ul.querySelectorAll(`[data-jewel]`)[i].innerHTML);
            }
            postEls(ul.getAttribute("data-id"), liArray);
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
                    const inputTrimmed = this.$refs.panelInput.value.trim();
                    if (!inputTrimmed.length == 0) {
                        console.log(inputTrimmed)
                        editableElements[index].innerHTML = this.$refs.panelInput.value;
                    }
                    else{
                        editableElements[index].innerHTML = "&nbsp;";
                    }
                    

                    if (editableElements[index].tagName == "LI") {
                        const ul = document.querySelector("[data-active = true]").closest("ul");
                        let liArray = [];
                        for (let i = 0; i < ul.querySelectorAll(`[data-jewel]`).length; i++) {
                            liArray.push(ul.querySelectorAll(`[data-jewel]`)[i].innerHTML);
                        }
                        postEls(ul.getAttribute("data-id"), liArray);
                    }else{
                        const elId = editableElements[index].getAttribute("data-id");
                        const elContent = editableElements[index].innerHTML;

                        postEls(elId, elContent);                       
                    }
                    editableElements[index].setAttribute("data-active", "false");
                }       
            }           
        },

        deleteEl() {
            for (let index = 0; index < editableElements.length; index++) {
                if (editableElements[index].getAttribute("data-active") == "true") {

                        if (editableElements[index].tagName == "LI") {
                            const ul = document.querySelector("[data-active = true]").closest("ul");
                            editableElements[index].remove();
                            let liArray = [];
                            for (let i = 0; i < ul.querySelectorAll(`[data-jewel]`).length; i++) {
                                liArray.push(ul.querySelectorAll(`[data-jewel]`)[i].innerHTML);
                            }
                            postEls(ul.getAttribute("data-id"), liArray);
    
                        }else{
                            editableElements[index].remove(); 
                        }
                        editableElements = document.querySelectorAll(`[data-jewel]`);
                }       
            }
        }
    }
}

/* 
Problemy:
    - To, kdy dobehnou GET requesty zjistuji asi shit zpusobem.
    - V GET requestu mam render elementu za pomoci dat ze serveru -- je to takhle ok? ja myslim, ze ne, lol
    - na POSTovani ul,li dat mam funkci 3x zkopirovanou, protoze je vzdycky malilinko jina. save() a add() se da ez poresit parametrem, delete moc nevim :(.
    - Celkove tento kod zacina byt neprehledny, si myslim, a kdyz takhle budu pokracovat tak to budu mit dobry bolonsky spaghetti.
*/