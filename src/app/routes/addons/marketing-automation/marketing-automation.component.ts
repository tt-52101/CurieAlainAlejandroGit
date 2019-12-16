import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { nodeTypes, nodeSubTypes } from './nodes';
import { ModulosService, CrmService, LoginService } from '@core';
import { FullContentService } from '@delon/abc';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import cyUR from 'cytoscape-undo-redo';
import { SFComponent, SFSchema } from '@delon/form';
import { Modules } from '@shared/utils/modules.enum';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-addons-marketing-automation',
  templateUrl: './marketing-automation.component.html',
  styleUrls: ['./marketing-automation.component.css'],
})
export class AddonsMarketingAutomationComponent implements OnInit {

  @ViewChild('sf') sf:SFComponent; // Objeto dynamic forms

  nodeProps = [];
  crmModules;
  crmModuleFields;
  crmMails;
  crmSegments;
  token = '';
  _nodeTypes = nodeTypes;
  _nodeSubtypes = nodeSubTypes;
  subTypeIndex = 0;
  selectedField = '';
  selectedFieldType = '';
  selectedFieldOptions = [];
  propsModalDisplay = false;
  nodesModalDisplay = false;
  graph;
  ur;
  formSchema: SFSchema;
  selectedNode: any;
  selectedEdge: '';
  selectedNodeProperties: {};
  confirmModal: NzModalRef; // For testing by now
  newId = new Date().getTime();
  branchModal: NzModalRef<{}, any>;
  selectedBranch;
  layoutOptions = {
    name: 'dagre',
    rankDir: 'TB',
    rankSep: 200, // the separation between adjacent nodes in the same rank
    edgeSep: 200, // the separation between adjacent edges in the same rank
    nodeDimensionsIncludeLabels: "true"
  }
  urOptions = {
    isDebug: true, // Debug mode for console messages
    actions: {},// actions to be added
    undoableDrag: false, // Whether dragging nodes are undoable can be a function as well
    stackSizeLimit: undefined, // Size limit of undo stack, note that the size of redo stack cannot exceed size of undo stack
    ready: function () { // callback when undo-redo is ready
      console.log("UR Ready")
    }
  }

  constructor(
    public msgSrv: NzMessageService,
    private modulosService: ModulosService,
    private fullContentService: FullContentService,
    private nzModalService: NzModalService,
    private crmService: CrmService,
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.selectedNode = null;
    this.formSchema = {
        "properties": {},
        "required": []
      };

    this.fullContentService.toggle();
    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params["token"];
      this.loginService.refreshLogin( this.token ).subscribe(async (res) => {
        this.getEmailTemplates();
        this.getModules();
      },
      (err) => console.log(err));;
    });
    // this.modulosService.getToken().subscribe( res => {
    //   this.token = res["result"].token;


    //   // this.getSegments();
    // },
    // (err) => {
    //   console.log(err);
    // });

    this.initChart();
  }

  initChart(){
    const this_ = this;
    cytoscape.use(dagre);
    this.graph = cytoscape({
      container: document.getElementById('graphDiv'), // container to render in
      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'label': 'data(icon)',
            'font-family': 'FontAwesome',
            'text-valign': 'center',
            "font-size": "50px",
            'width': '100px',
            'height': '100px',
            'background-color': '#edf7ff',
            'text-background-color': 'black',
          }
        },
        {
          selector: 'node[type="Eventos"]',
          style: {
            'shape': 'octagon',
            'background-color': '#3ac394',

          }
        },
        {
          selector: 'node[type="Acciones"]',
          style: {
            'background-color': '#48c7c8',
          }
        },
        {
          selector: 'node[type="Stop"]',
          style: {
            'background-color': '#eb687f',
          }
        },
        {
          selector: 'node[type="Start"]',
          style: {
            'background-color': '#545b62'


          }
        },
        {
          selector: 'node[type="True"]',
          style: {
            'background-color': '#64d188',
            'color': 'black',
            'width': '75px',
            'height': '75px',
            "font-size": "45px",
            'border-color': '#3c8655',
            'border-width': '1',

          }
        },
        {
          selector: 'node[type="False"]',
          style: {
            'background-color': '#ff4d44',
            'color': 'black',
            'width': '75px',
            'height': '75px',
            "font-size": "45px",
            'border-color': '#802521',
            'border-width': '1',

          }
        },
        {
          selector: 'edge',
          style: {
            'text-events': 'yes',
            'font-family': 'FontAwesome',
            'width': 10,
            'height': 150,
            'label': "data(icon)",
            'color': "black",
            "font-size": "50px",
            'text-background-color': 'orange',
            'text-background-opacity': '1',
            'text-background-shape': 'roundrectangle',
            'text-background-padding': '1px',
            // 'text-border-width': '0.5px',
            // 'text-border-style': 'solid',
            // 'text-border-color': '#ccc',
            // 'text-border-opacity': '1',
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
          },
        },
        {
          selector: ':selected',
          style: {
            'border-color': 'red',
            'border-width': '4',
          }
        }
      ],
      elements: [ // list of graph elements to start with
        { // node a
          data: { id: this.newId, icon: '\uf04b', type: 'Start' }
        },
        { // node b
          data: { id: this.newId + 1, icon: '\uf04d', type: 'Stop' }
        },
        { // edge ab
          data: { id: `${this.newId}to${this.newId + 1}`, source: this.newId, target: this.newId + 1, icon: '+'}
        }
      ]
    });
    this.graph.on('click', 'edge', function(e){
      this_.selectedEdge = e.target.id();
      this_.toggleNodesModal(e);
    });
    this.graph.on('click', 'node', function(e){
      this_.selectedNode = e.target.id();
      this_.togglePropsModal();
    });
    this.graph.on('unselect', 'node', function(e){
      this_.selectedNode = null;
    });
    this.refreshGraph();
    let aux = new cyUR(cytoscape); // ??
    this.ur = this.graph.undoRedo(this.urOptions);
    this.graph.minZoom(-5);
    this.graph.maxZoom(10);
    this.graph.$('node').ungrabify();

  }

  insertNode(type: string, subtype: string){
    let node;
    const this_ = this;
    this.newId = new Date().getTime();
    let newId = this.newId;
    for (let i = 0; i < this._nodeSubtypes.length; i++) {
      if (this._nodeSubtypes[i].shortName === subtype) {
        node = {
          description: this._nodeSubtypes[i].description,
          icon: this._nodeSubtypes[i].icon,
          name: this._nodeSubtypes[i].name,
          properties: JSON.parse(JSON.stringify(this._nodeSubtypes[i].properties)),
          shortName: this._nodeSubtypes[i].shortName,
          type: this._nodeSubtypes[i].type,

        };
        let keys = Object.keys(node.properties);
        keys.forEach(key => {
          if ( key === 'delay_unit'){
            node.properties[key].ui.change = (model) => {
              this.changeTimeUnit(model);
            }
          }
          else {
            node.properties[key].ui.change = this._nodeSubtypes[i].properties[key].ui.change || undefined;
          }
        });
        break;
      }
    }
    try{
      if (this.validInsert()) {
        if(node.type === 'Acciones'){
          this.ur.do("add", [
            {
              group: 'nodes',
              data: {
                id: newId,
                shortName: node.shortName,
                name: node.name,
                description: node.description,
                icon: node.icon,
                type: node.type,
                properties: node.properties
              },
            },
            {
              group: 'edges',
              data: {
                id: `${newId}to${this_.graph.$(`#${this_.selectedEdge}`).target().id()}`,
                source: newId,
                target: `${this_.graph.$(`#${this_.selectedEdge}`).target().id()}`,
                icon: '+'

              },
            }
          ]);
          let edge_ = this.graph.$(`#${this.selectedEdge}`);
          this.ur.do("move", {
            eles: `#${this.graph.$(`#${this.selectedEdge}`).id()}`,
            location: {
              target: newId.toString(),
            }
          });
        }
        else {
          let conditions = [];

          for (let i = 0; i < this._nodeSubtypes.length; i++) {
            if (this._nodeSubtypes[i].shortName === 'True' || this._nodeSubtypes[i].shortName === 'False') {
              conditions.push(this._nodeSubtypes[i]);
            }
          }

          // Condition node
          this.ur.do("add",{
            group: 'nodes',
            data: {
              id: newId,
              shortName: node.shortName,
              name: node.name,
              description: node.description,
              icon: node.icon,
              type: node.type,
              properties: node.properties
            },
          });

          // True Node
          this.ur.do("add",{
            group: 'nodes',
            data: {
              id: newId + 1,
              shortName: conditions[0].shortName,
              name: conditions[0].name,
              description: conditions[0].description,
              icon: conditions[0].icon,
              type: conditions[0].type,
            },
          });

          // False Node
          this.ur.do("add",{
            group: 'nodes',
            data: {
              id: newId + 2,
              shortName: conditions[1].shortName,
              name: conditions[1].name,
              description: conditions[1].description,
              icon: conditions[1].icon,
              type: conditions[1].type
            },
          });

          // Stop Node
          this.ur.do("add",{
            group: 'nodes',
            data: {
              id: newId + 3,
              icon: '\uf04d' ,
              type: 'Stop'
            },
          });

          // Source to condition
          this.ur.do("add",{
            group: 'edges',
            data: {
              id: `${this_.graph.$(`#${this_.selectedEdge}`).source().id()}to${newId}`,
              source: `${this_.graph.$(`#${this_.selectedEdge}`).source().id()}`,
              target: newId,
              icon: '+'
            },
          });

          // Condition to True
          this.graph.add({
            group: 'edges',
            data: {
              id: `${this_.graph.$(`#${newId}`).id()}to${newId + 1}`,
              source: `${this_.graph.$(`#${newId}`).id()}`,
              target: newId + 1,
            },
          });

          // Condition to False
          this.graph.add({
            group: 'edges',
            data: {
              id: `${this_.graph.$(`#${newId}`).id()}to${newId + 2}`,
              source: `${this_.graph.$(`#${newId}`).id()}`,
              target: newId + 2,
            },
          });

          // False to stop
          this.graph.add({
            group: 'edges',
            data: {
              id: `${newId + 2}to${newId + 3}`,
              source: newId + 2,
              target: newId + 3,
              icon: '+'
            },
          });

          this.graph.$(`#${this.selectedEdge}`).move({source: `${newId + 1}`});
        }
      }
      else {
        throw new Error("Invalid node insertion.");
      }
    }
    catch(err) {
      this.msgSrv.create("error", `Errors inserting the nodes: \n ${err}`);

    }
    finally{
      this.graph.layout(this.layoutOptions).run();
      this.nodesModalDisplay = false;
      this.graph.$('node').ungrabify();
    }
  }

  validInsert(): boolean {
    let source = this.graph.$(`#${this.selectedEdge}`).data("source")
    let target = this.graph.$(`#${this.selectedEdge}`).data("target")
    source = this.graph.$(`#${source}`).data("type")
    target = this.graph.$(`#${target}`).data("type")

    if(source === 'Eventos' && (target === 'True' || target === 'False' )){
      return false
    }

    return true;
  }

  confirmDelete() {
    if(this.selectedNode !== null) {
      this.confirmModal = this.nzModalService.confirm({
        nzTitle: 'Do you Want to delete this node?',
        nzContent: 'You can\'t reverse this action',
        nzOnOk: () =>
          new Promise((resolve, reject) => {
            this.deleteNode();
            setTimeout(true ? resolve : reject, 500);
          }).catch((err) => console.log(err))
      });
    }
    else {
      this.msgSrv.create('warning', "Seleccione un nodo antes de realizar esta acción")
    }
  }

  chooseBranch() {
    this.branchModal = this.nzModalService.create({
      nzTitle: 'Wich branch do you want to conserve',
      nzContent: 'You can\'t reverse this action',
      nzFooter: [
        {
          label: 'True branch',
          shape: 'primary',
          onClick: () => {
            this.branchModal.close();
            this.deleteEvent("True")
          }
        },
        {
          label: 'False branch',
          type: 'primary',
          onClick: () => {
            this.branchModal.close();
            this.deleteEvent("False")
          }
        },
      ]
    });
  }

  deleteNode() {
    let selectedNode = this.graph.$(`#${this.selectedNode}`);
    try{
      if (this.validDelete()) {
        if (selectedNode.data("type") === "Acciones"){
          this.deleteAction(selectedNode);
        }
        if (selectedNode.data("type") === 'Eventos') {
          this.chooseBranch();
        }
        this.refreshGraph();
      }
      else {
        throw new Error("Invalid node type to delete")
      }
    }
    catch (err) {
      this.msgSrv.create("error", `Errors deleting the node: \n ${err}`);
    }
  }

  deleteAction(nodeToDelete: any) {
    let edges = nodeToDelete.connectedEdges();
    let newEdge = {
      source: "",
      target: ""
    }
    edges.forEach(el => {
      if (el.source().id() != nodeToDelete.id()) {
        newEdge.source = el.source().id();
      }
      if (el.target().id() != nodeToDelete.id()) {
        newEdge.target = el.target().id();
      }
    });
    this.graph.remove(nodeToDelete);
    this.graph.add({
      group: 'edges',
      data: {
        id: `${newEdge.source}to${newEdge.target}`,
        source: newEdge.source,
        target: newEdge.target,
        icon: '+'
      }
    });
    this.selectedNode = null;
  }

  refreshGraph() {
    this.graph.style().update();
    this.graph.layout(this.layoutOptions).run();
  }

  deleteEvent(branch: string) {
    let edges = this.graph.$(`#${this.selectedNode}`).connectedEdges();
    let nodes = new Array(2);
    let newEdge = {
      source: "",
      target: ""
    }

    edges.forEach(edge => {
      let node = this.graph.$(`#${edge.target().id()}`);
      if (edge.target().id() === this.selectedNode) {
        newEdge.source = edge.source().id();
      }
      if (node.data("shortName") === 'True') {
        nodes[1] = node;
      }
      if (node.data("shortName") === 'False') {
        nodes[0] = node;
      }
    });
    this.graph.$(`#${this.selectedNode}`).remove();
    if (branch === 'True') {
      newEdge.target = nodes[1].id();
      this.graph.add({
        group: 'edges',
        data: {
          id: `${newEdge.source}to${newEdge.target}`,
          source: newEdge.source,
          target: newEdge.target,
          icon: '+'
        }
      });
      nodes[0].successors().remove();
      nodes[0].remove();
      this.deleteAction(nodes[1])
    }
    if (branch === 'False') {
      newEdge.target = nodes[0].id();
      this.graph.add({
        group: 'edges',
        data: {
          id: `${newEdge.source}to${newEdge.target}`,
          source: newEdge.source,
          target: newEdge.target,
          icon: '+'

        }
      });
      nodes[1].successors().remove();
      nodes[1].remove();
      this.deleteAction(nodes[0])
    }
    this.refreshGraph();
    this.selectedNode = null;
  }

  validDelete(): boolean {
    let type =  this.graph.$(`#${this.selectedNode}`).data("type");
    if ( type === 'Start' || type === 'Stop' || type === 'Condiciones') {
      return false;
    }
    return true
  }

  async getModuleFields(model) {
    this.crmModuleFields = [...await this.crmService.getLists(Modules.fields,  {params:{mod: model}}).pipe( map( res => res.map( e => ({...e, value: e.id})))).toPromise()];

    this.formSchema.properties.module_id.default = model;
    this.formSchema.properties.field_id.enum = JSON.parse(JSON.stringify(this.crmModuleFields));
    this.sf.refreshSchema();
    this.formSchema.properties.module_id["value"] = model;
  }

  getSegments() {
    // this.modulosService.getSegments(this.token).subscribe( res => {
    //   res = this.crmSegments;
    //   this._nodeSubtypes[this.getSubtypeIndex("AddToSegment")].properties.segment_id.enum = this.crmMails;
    //   this._nodeSubtypes[this.getSubtypeIndex("RemoveFromSegment")].properties.segment_id.enum = this.crmMails;
    // },
    // err => {
    //   console.log(err);
    // });
  }

  async getEmailTemplates() {
    this.crmMails = [...await this.crmService.getLists(Modules.plantillas).pipe( map( res => res.map( e => ({...e, label: e.name, value: e.id})))).toPromise()];
    this._nodeSubtypes[this.getSubtypeIndex("SendEmail")].properties.mail_id.enum = this.crmMails;
    this._nodeSubtypes[this.getSubtypeIndex("EmailOpened")].properties.mail_id.enum = this.crmMails;;
  }

  async getModules() {
    this.crmModules = [...await this.crmService.getLists(Modules.modulos).toPromise()];
    console.log(this.crmModules);
    this._nodeSubtypes[this.getSubtypeIndex("CheckFieldValue")].properties.module_id.enum = this.crmModules;
    this._nodeSubtypes[this.getSubtypeIndex("CheckFieldValue")].properties.module_id.ui.change = (model) => {
      this.getModuleFields(model);
    }
    this._nodeSubtypes[this.getSubtypeIndex("CheckFieldValue")].properties.field_id.ui.change = (model) => {
      this.getFieldType(model);
    }
    this._nodeSubtypes[this.getSubtypeIndex("UpdateField")].properties.module_id.enum = this.crmModules;
    this._nodeSubtypes[this.getSubtypeIndex("UpdateField")].properties.module_id.ui.change = (model) => {
      this.getModuleFields(model);
    }
    this._nodeSubtypes[this.getSubtypeIndex("UpdateField")].properties.field_id.ui.change = (model) => {
      this.getFieldType(model);
    }
  }

  getFieldType(model) {
    let nodeProperties = this.graph.$(`#${this.selectedNode}`).data("properties");
    let options = nodeProperties.field_id.enum;
    for(let i = 0; i < options.length; i++){
      if (options[i].value === model) {
        const type = options[i].type;
        switch (true) {
          case  type === 'text' || type === 'tel' || type === 'email' || type === 'number' || type === 'textarea' || type === 'time' || type === 'date' || type === 'url':
            nodeProperties.input_value.type = 'string';
            nodeProperties.input_value.format = type || '';
            nodeProperties.field_id.value = model;
            nodeProperties.field_id.default = model;
            nodeProperties.input_value.enum = undefined;
            nodeProperties.input_value.ui.widget = undefined;
          break;
          case type === 'tel':
            nodeProperties.input_value.format = 'mobile';
          break;
          case type === 'select':
            nodeProperties.input_value.ui.widget = type;
            nodeProperties.input_value.enum = options[i].options;
            nodeProperties.field_id.value = model;
            nodeProperties.field_id.default = model;
          break;

          case type === 'checkbox':
            nodeProperties.input_value.type = 'boolean';
            nodeProperties.input_value.ui.widget = type;
            nodeProperties.input_value.enum = undefined;
            nodeProperties.field_id.value = model;
            nodeProperties.field_id.default = model;
          break;
        }
        this.sf.refreshSchema();
      }
    }
  }

  changeTimeUnit(e) {
    this.formSchema.properties.delay_value.ui["unit"] = e;
    this.formSchema.properties.delay_unit["value"] = e;
    this.formSchema.properties.delay_unit["default"] = e;

    this.sf.refreshSchema();
  }

  getSubtypeIndex(shortName) {
    try{
      for (let i = 0; i < this._nodeSubtypes.length; i++) {
        if(this._nodeSubtypes[i].shortName === shortName){
          return i;
        }
      }
    }
    catch (err) {
      this.msgSrv.create("error", `Error getting node index, node doesn't exists. \n ${err}`);
    }
  }

  togglePropsModal() {
    let selectedNode = this.graph.$(`#${this.selectedNode}`);
    if (this.selectedNode !== null) {
      if( selectedNode.data("type") === 'Acciones' || selectedNode.data("type") === 'Eventos' ) {
        this.propsModalDisplay = !this.propsModalDisplay;
        if (this.propsModalDisplay) {
          this.fillInputs();
        }
        else  {
          let submitButton = document.querySelector("#propForm button[type='submit']") as HTMLFormElement
          submitButton.click();
        }
      }
      else {
        this.msgSrv.create('warning', "Este nodo no tiene propiedades para modificar")
      }
    }
    else {
      this.msgSrv.create('warning', "Seleccione un nodo antes de realizar esta acción")
    }
  }

  toggleNodesModal(e) {
    this.nodesModalDisplay = !this.nodesModalDisplay;
  }

  fillInputs() {
    try{
      let keys = Object.keys(this.graph.$(`#${this.selectedNode}`).data("properties"));
      this.selectedNodeProperties ={...this.graph.$(`#${this.selectedNode}`).data("properties")}
      keys.forEach(key => {
        this.selectedNodeProperties[key].default = this.selectedNodeProperties[key].value // SET DEFAULT TO DISPLAY THE SELECTED VALUE
      });
      this.formSchema = {
        "properties": {...this.selectedNodeProperties}
      }
    }
    catch (err) {
      this.msgSrv.create("error", `Error getting node properties. \n ${err}`);
    }
  }


  saveProperties(e) {
    try{
      for (const key in e) {
        this.selectedNodeProperties[key].default = undefined;
        if (e.hasOwnProperty(key)) {
          this.selectedNodeProperties[key].value = e[key];
        }
      }
      this.graph.$(`#${this.selectedNode}`).data(`properties`, {...this.selectedNodeProperties});
      this.msgSrv.create("success", "Properties saved properly.");
      if(this.propsModalDisplay) this.propsModalDisplay = false;
    }
    catch(err) {
      this.msgSrv.create("error", `Errors during property save: \n ${err}.`);
    }
  }

  generateJSON() {
    try {
      console.log(this.graph.json(true));
      localStorage.setItem("campaign", JSON.stringify(this.graph.json()));
      this.msgSrv.create("success", `Campaña guardada con éxito.`);
    }
    catch(err) {
      this.msgSrv.create("error", `Error al guardar el grafo: \n ${err}.`);
    }
  }

}
