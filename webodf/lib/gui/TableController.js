/**
 * Copyright (C) 2013 KO GmbH <copyright@kogmbh.com>
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

/*global gui, odf, ops */

/**
 * @constructor
 * @param {!ops.Session} session
 * @param {!string} inputMemberId
 * @param {!odf.ObjectNameGenerator} objectNameGenerator
 */
gui.TableController = function TableController(
    session,
    inputMemberId,
    objectNameGenerator
    ) {
    "use strict";
    
    var odtDocument = session.getOdtDocument(),
        tablens = odf.Namespaces.tablens; 
    
    /**
     * @param {!string} tableStyleName
     * @param {!string} tableColumnStyleName
     * @param {!string} tableCellStyleName
     */
    function addDefaultTableStyle (tableStyleName,tableColumnStyleName,tableCellStyleName) {
        var op = new ops.OpAddStyle();
        op.init({
            memberid: inputMemberId,
            styleName: tableStyleName,
            styleFamily: 'table',
            isAutomaticStyle: true,
            setProperties: {
                "style:table-properties": {
                    "style:column-width": "1.7313in",
                    "style:rel-column-width": "16383*"
                }
            }
        });
        session.enqueue([op]);
        
        op = new ops.OpAddStyle();
        op.init({
            memberid: inputMemberId,
            styleName: tableColumnStyleName,
            styleFamily: 'table-column',
            isAutomaticStyle: true,
            setProperties: {
                "style:table-column-properties": {
                    "style:column-width": "1.7313in",
                    "style:rel-column-width": "16383*"
                }
            }
        });
        session.enqueue([op]);
        
        op = new ops.OpAddStyle();
        op.init({
            memberid: inputMemberId,
            styleName: tableCellStyleName,
            styleFamily: 'table-cell',
            isAutomaticStyle: true,
            setProperties: {
                "style:table-cell-properties": {
                    "fo:padding": "0.0382in",
                    "fo:border-left": "0.05pt solid #000000",
                    "fo:border-right": "0.05pt solid #000000",
                    "fo:border-top": "0.05pt solid #000000",
                    "fo:border-bottom": "0.05pt solid #000000"
                }
            }
        });
        session.enqueue([op]);
    }
    
    /**
     * @param {!number} initialRows
     * @param {!number} initialColumns
     * @param {!string} tableStyleName
     * @param {!string} tableColumnStyleName
     * @param {!Array.<!Array.<string>>} tableCellStyleMatrix
     * @param {!string} tableName
     */
    function insertTable (initialRows, initialColumns, tableStyleName, tableColumnStyleName, tableCellStyleMatrix, tableName) {
            var op = new ops.OpInsertTable();
            op.init({
                memberid: inputMemberId,
                position: odtDocument.getCursorPosition(inputMemberId),
                initialRows: initialRows,
                initialColumns: initialColumns,
                tableStyleName: tableStyleName,
                tableColumnStyleName: tableColumnStyleName,
                tableCellStyleMatrix: tableCellStyleMatrix,
                tableName: tableName
            });
            session.enqueue([op]);
    }
    
    /**
     * @param {!number} initialRows
     * @param {!number} initialColumns
     */
    this.createNewTable = function (initialRows,initialColumns)
    {
        var tableStyleName = objectNameGenerator.generateStyleName(),
            tableColumnStyleName = objectNameGenerator.generateStyleName(),
            /**@type{!Array.<!Array.<string>>}*/
            tableCellStyleMatrix = [],
            tableName = objectNameGenerator.generateTableName();
        
        tableCellStyleMatrix.push([]);
        tableCellStyleMatrix[0].push(objectNameGenerator.generateStyleName());
        
        insertTable(initialRows,initialColumns,tableStyleName,tableColumnStyleName,tableCellStyleMatrix,tableName);
    };
    
    /**
     * @param {{memberId:!string, tableElement:!Element}} args
     */
    function onTableAdded (args) {
        if (args.memberId === inputMemberId) {
            var tableNode = args.tableElement,
                /**@type{!Element}*/ 
                tableColumnNode = tableNode.getElementsByTagName('table-column')[0],
                /**@type{!Element}*/
                tableCellNodes = tableNode.getElementsByTagName('table-cell')[0],
                /**@type{!string}*/
                tableStyleName = tableNode.getAttributeNS(tablens,'style-name'),
                /**@type{!string}*/
                tableColumnStyleName = tableColumnNode.getAttributeNS(tablens,'style-name'),
                /**@type{!string}*/
                tableCellStyleName = tableCellNodes.getAttributeNS(tablens,'style-name');
            
            addDefaultTableStyle(tableStyleName,tableColumnStyleName,tableCellStyleName);
        }
    }
    /**
     * @param {!function(!Error=)} callback, passing an error object in case of error
     * @return {undefined}
     */
    this.destroy = function (callback) {
        odtDocument.unsubscribe(ops.OdtDocument.signalTableAdded, onTableAdded);
        callback();
    };
    
    function init() {
        odtDocument.subscribe(ops.OdtDocument.signalTableAdded, onTableAdded);
    }
    init();
};
