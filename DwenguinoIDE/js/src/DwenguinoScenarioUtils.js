function DwenguinoScenarioUtils(scenario){
    this.scenario = scenario;
}

/**
 * Clear all canvases in the simulator that are part
 * of the "sim_canvas" class.
 */
DwenguinoScenarioUtils.prototype.saveScenario = function(data){
    if (window.dwenguinoBlocklyServer){
        window.dwenguinoBlocklyServer.saveScenario(data);
    } else {
        DwenguinoBlockly.download("scenario.xml", data);
    }
    DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("downloadScenarioClicked", ""));
}

DwenguinoScenarioUtils.prototype.loadScenario = function(scenario){
    var self = this; 
    if (window.dwenguinoBlocklyServer){
        this.scenario.xml = window.dwenguinoBlocklyServer.loadScenario();
        this.scenario.loadFromXml();
    } else{
        if (window.File && window.FileReader && window.FileList && window.Blob) {

            $('#blocklyDiv').append('<div id="dropzoneModal" class="modal fade" role="dialog"></div>');
            $('#dropzoneModal').append('<div id="modalDialog" class="modal-dialog"></div>');
            $('#modalDialog').append('<div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">Upload</h4></div>');
            $('#modalDialog').append('<div class="modal-body">Selecteer een bestand.<input type="file" id="fileInput"><div id="filedrag">of zet ze hier neer</div><pre id="fileDisplayArea"><pre></div>');
            $('#modalDialog').append('<div class="modal-footer"><button id="submit_upload_modal_dialog_button" type="button" class="btn btn-default" data-dismiss="modal">Ok</button></div>');

            $("#dropzoneModal").modal('show');

            var processFile = function(file){
              var textType = /text.*/;
    
              if (file.type.match(textType)) {
                var reader = new FileReader();
    
                reader.onload = function(e) {
                  fileDisplayArea.innerText = file.name;
                  self.scenario.xml = reader.result;
                }
    
                reader.readAsText(file);
              } else {
                fileDisplayArea.innerText = "File not supported!"
              }
            }
    
            var fileInput = document.getElementById('fileInput');
            var fileDisplayArea = document.getElementById('fileDisplayArea');
    
            fileInput.addEventListener('change', function(e) {
              var file = fileInput.files[0];
              processFile(file);
            });
    
            // file drag hover
            var FileDragHover = function(e) {
              e.stopPropagation();
              e.preventDefault();
              e.target.className = (e.type == "dragover" ? "hover" : "");
            };
    
            // file selection
            var FileSelectHandler = function(e) {
              // cancel event and hover styling
              FileDragHover(e);
              // fetch FileList object
              var files = e.target.files || e.dataTransfer.files;
              var file = files[0];
              processFile(file);
            };
    
            var filedrag = document.getElementById("filedrag");
            filedrag.addEventListener("dragover", FileDragHover, false);
            filedrag.addEventListener("dragleave", FileDragHover, false);
            filedrag.addEventListener("drop", FileSelectHandler, false);
            filedrag.style.display = "block";

            $("#submit_upload_modal_dialog_button").click(function(){
                self.scenario.loadFromXml();
            });

        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
    }
}

DwenguinoScenarioUtils.prototype.textToDom = function(text){
    var oParser = new DOMParser();
    var dom = oParser.parseFromString(text, 'text/xml');
    // The DOM should have one and only one top-level node, an XML tag.
    if (!dom || !dom.firstChild ||
        dom.firstChild.nodeName.toLowerCase() != 'xml' ||
        dom.firstChild !== dom.lastChild) {
      // Whatever we got back from the parser is not XML.
      goog.asserts.fail('Blockly.Xml.textToDom did not obtain a valid XML tree.');
    }
    return dom.firstChild;
}