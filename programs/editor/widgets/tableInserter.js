/**
 * Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>
 *
 * @licstart
 * This file is part of WebODF.
 *
 * WebODF is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License (GNU AGPL)
 * as published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * WebODF is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WebODF.  If not, see <http://www.gnu.org/licenses/>.
 * @licend
 *
 * @source: http://www.webodf.org/
 * @source: https://github.com/kogmbh/WebODF/
 */

/*global define,runtime*/

define("webodf/editor/widgets/tableInserter", [
    "dijit/form/DropDownButton",
    "dijit/DropDownMenu",
    "dijit/form/NumberTextBox",
    "dijit/form/Button"],
 
    function (DropDownButton,DropDownMenu,NumberTextBox,Button) {
        "use strict";
        
        var TableInserter = function (callback) {
              var self=this,
                  editorSession,
                  tableController,
                  widget = {},
                  tableDropdown,
                  dropDownMenu,
                  rowsNumberTextBox,
                  columnsNumberTextBox,
                  button;
            
            dropDownMenu = new DropDownMenu ({});
            
            rowsNumberTextBox = new NumberTextBox ({
                placeHolder: "rows",
                constraints: {min:1,max:1000,places:0}
            });
            dropDownMenu.addChild(rowsNumberTextBox);
            
            columnsNumberTextBox = new NumberTextBox ({
                placeHolder: "columns",
                constraints: {min:1,max:1000,places:0}
            });
            dropDownMenu.addChild(columnsNumberTextBox);
            
            button= new Button ({
                label:"ok",
                onClick: function () {
                    tableController.createNewTable(rowsNumberTextBox.value,columnsNumberTextBox.value);
                    self.onToolDone();
                }
            });
            dropDownMenu.addChild(button);

                tableDropdown = new DropDownButton ({
                label: runtime.tr('Table'),
                disabled: false,
                showLabel: false,
                iconClass: "dijitEditorIcon dijitEditorIconInsertTable",
                dropDown: dropDownMenu
            });
            
            widget.children = [dropDownMenu,tableDropdown];
            widget.startup = function () {
                widget.children.forEach(function (element) {
                    element.startup();
                });
            };

            widget.placeAt = function (container) {
                widget.children.forEach(function (element) {
                    element.placeAt(container);
                });
                return widget;
            };
            
            this.setEditorSession = function (session) {
                editorSession = session;
                if (editorSession) {
                    tableController = editorSession.sessionController.getTableController();
                }
            };
            
            /*jslint emptyblock: true*/
            this.onToolDone = function () {};
            /*jslint emptyblock: false*/

            callback(widget);

        };
        
        return TableInserter;
    });
            
