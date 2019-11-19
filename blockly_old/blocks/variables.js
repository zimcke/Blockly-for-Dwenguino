/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Variable blocks for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Blocks.variables');

goog.require('Blockly.Blocks');


/**
 * Common HSV hue for all blocks in this category.
 */
Blockly.Blocks.variables.HUE = 90;
Blockly.Blocks.variables.HUE_INT = 65;
Blockly.Blocks.variables.HUE_STR = 160;

Blockly.Blocks['variables_get'] = {
  /**
   * Block for variable getter.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_GET_HELPURL);
    this.setColour(Blockly.Blocks.variables.HUE);
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable(
        Blockly.Msg.VARIABLES_DEFAULT_NAME), 'VAR');
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;
  },
  contextMenuType_: 'variables_set',
  /**
   * Add menu option to create getter/setter block for this setter/getter.
   * @param {!Array} options List of menu options to add to.
   * @this Blockly.Block
   */
  customContextMenu: function(options) {
    var option = {enabled: true};
    var name = this.getFieldValue('VAR');
    option.text = this.contextMenuMsg_.replace('%1', name);
    var xmlField = goog.dom.createDom('field', null, name);
    xmlField.setAttribute('name', 'VAR');
    var xmlBlock = goog.dom.createDom('block', null, xmlField);
    xmlBlock.setAttribute('type', this.contextMenuType_);
    option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
    options.push(option);
  }
};



Blockly.Blocks['variables_set'] = {
  /**
   * Block for variable setter.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.VARIABLES_SET,
      "args0": [
        {
          "type": "field_variable",
          "name": "VAR",
          "variable": Blockly.Msg.VARIABLES_DEFAULT_NAME
        },
        {
          "type": "input_value",
          "name": "VALUE"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.variables.HUE,
      "tooltip": Blockly.Msg.VARIABLES_SET_TOOLTIP,
      "helpUrl": Blockly.Msg.VARIABLES_SET_HELPURL,
    });
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
  },
  contextMenuType_: 'variables_get',
  customContextMenu: Blockly.Blocks['variables_get'].customContextMenu
};


Blockly.Blocks['variables_declare_set'] = {
    /**
     * Block for variable setter.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.VARIABLES_SET,
            "args0": [
                {
                    "type": "field_variable",
                    "name": "VAR",
                    "variable": Blockly.Msg.VARIABLES_DEFAULT_NAME
                },
                {
                    "type": "input_value",
                    "name": "VALUE",
                    "check": "Number"
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": Blockly.Blocks.variables.HUE_INT,
            "tooltip": Blockly.Msg.VARIABLES_SET_TOOLTIP,
            "helpUrl": Blockly.Msg.VARIABLES_SET_HELPURL
        });

        this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    },
    contextMenuType_: 'variables_get',
    customContextMenu: Blockly.Blocks['variables_get'].customContextMenu
};

Blockly.Blocks['variables_declare_set_string'] = {
    /**
     * Block for variable setter.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.VARIABLES_SET,
            "args0": [
                {
                    "type": "field_variable",
                    "name": "VAR",
                    "variable": Blockly.Msg.VARIABLES_DEFAULT_NAME,
                    "variableTypes": ["String"]
                },
                {
                    "type": "input_value",
                    "name": "VALUE",
                    "check": "String"
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": Blockly.Blocks.variables.HUE_STR,
            "tooltip": Blockly.Msg.VARIABLES_SET_TOOLTIP,
            "helpUrl": Blockly.Msg.VARIABLES_SET_HELPURL
        });

        this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    },
    contextMenuType_: 'variables_get',
    customContextMenu: Blockly.Blocks['variables_get'].customContextMenu
};




var variables_declare_json =
        {
            "type": "variables_declare",
            "message0": MSG.create + " %1 %2" + MSG.with_type + " %3",
            "args0": [
                {
                    "type": "field_variable",
                    "name": "VAR",
                    "variable": "item"
                },
                {
                    "type": "input_dummy"
                },
                {
                    "type": "field_dropdown",
                    "name": "TYPE",
                    "options": [
                        [
                            "int",
                            "int"
                        ],
                        [
                            "double",
                            "double"
                        ],
                        [
                            "String",
                            "String"
                        ],
                        [
                            "char",
                            "char"
                        ],
                        [
                            "unsigned int",
                            "unsigned int"
                        ],
                        [
                            "unsigned char",
                            "unsigned char"
                        ]
                    ]
                }
            ],
            "inputsInline": true,
            "previousStatement": null,
            "nextStatement": null,
            "tooltip": "",
            "colour": Blockly.Blocks.variables.HUE,
            "helpUrl": "http://www.dwengo.org/"
        };


Blockly.Blocks['variables_declare'] = {
    init: function () {
        this.jsonInit(variables_declare_json);
    }
};

var variables_declare_global_json =
        {
            "type": "variables_declare_global",
            "message0": MSG.create_global + " %1 %2" + MSG.with_type + " %3",
            "args0": [
                {
                    "type": "field_variable",
                    "name": "VAR",
                    "variable": "item"
                },
                {
                    "type": "input_dummy"
                },
                {
                    "type": "field_dropdown",
                    "name": "TYPE",
                    "options": [
                        [
                            "int",
                            "int"
                        ],
                        [
                            "double",
                            "double"
                        ],
                        [
                            "String",
                            "String"
                        ],
                        [
                            "char",
                            "char"
                        ],
                        [
                            "unsigned int",
                            "unsigned int"
                        ],
                        [
                            "unsigned char",
                            "unsigned char"
                        ]
                    ]
                }
            ],
            "inputsInline": true,
            "previousStatement": null,
            "nextStatement": null,
            "tooltip": "",
            "colour": Blockly.Blocks.variables.HUE,
            "helpUrl": "http://www.dwengo.org/"
        };


Blockly.Blocks['variables_declare_global'] = {
    init: function () {
        this.jsonInit(variables_declare_global_json);
    }
};




