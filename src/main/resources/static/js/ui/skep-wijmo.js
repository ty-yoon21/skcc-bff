/***
* @name
* - skep-wijmo.js
*
* @description
* - SKEP STD Wijmo Wrapping
*
* @parameter
* -
*
* @author
* -
*
*/

/***
* @Contents
* 1. skepWijmo Object 생성
* 2. 라이센스 적용
* 3. skepStdWijmo.flexGrid
# Init (new wijmo.grid.FlexGrid(id, options))
           FlexGrid Options
                     Sorting, Column Resizing
                     Merging
                     Only column header cells are displayed.
                     Collection View
                     Row DefaultSize
                     Using Tab Key
                     Column Required Default Setting
                     Read Only (All)
                     Check Columns
           fg.itemFormatter (조건부 서식 - 차트 항목이 렌더링될 때 호출되는 콜백 함수를 지정)
        https://demo.mescius.co.kr/wijmo/docs/Topics/Chart/Advanced/Conditional-Format#flexchart-%EC%A1%B0%EA%B1%B4%EB%B6%80-%EC%84%9C%EC%8B%9D
           fg.findRow

           FlexGrid Event
               fg.formatItem.addHandler (조건부서식)
            - https://demo.mescius.co.kr/wijmo/docs/Topics/Grid/CustomCells/Conditional-Formatting
                     fg.beginningEdit.addHandler
                     fg.cellEditEnded.addHandler
                     fg.rowEditEnded.addHandler
                     fg.itemsSourceChanged.addHandler
                     fg.rowAdded.addHandler
                     fg.loadedRows.addHandler
                     fg.deletingRow.addHandler
                     fg.deletedRow.addHandler
                     fg.pastingCell.addHandler
                     fg.updatedLayout.addHandler

           Collection View - handler
                     - fg._cv.sourceCollectionChanged.addHandler
                     - fg._cv.collectionChanged.addHandler

           Column Required Default Setting
           Add Row 초기값 (newItem = true)
# Init - End


# SKEP STD - Wijmo Custom Function
           Filter
                     Grid Header Filter              - skep.flexGrid.filter(fg1);
                     Toggle Filter                   - skep.flexGrid.toggleFilter(fg1);
                     Grid Header Column Picker       - skepStdWijmo.flexGrid.columnPicker(fg1);
                     toggleColumnPicker              - skepStdWijmo.flexGrid.toggleColumnPicker(fg, this, id);

           Checker
        rowChecker                      - skepStdWijmo.flexGrid.getCheckedRow(fg1);
        colChecker                      - skepStdWijmo.flexGrid.getCheckedRow(fg1, colName);
                     getCheckedRow                   - skepStdWijmo.flexGrid.getCheckedRow(fg1);
                     setCheckColsVal

           Row Control --> Add / Delete / Moveup / MoveDown
                     addRow                          - skepStdWijmo.flexGrid.addRow(fg1);
                     addRowWithFilter                - skepStdWijmo.flexGrid.addRowWithFilter(fg1);
                     addRowSelected                  - skepStdWijmo.flexGrid.addRowSelected(fg1);
                     addRowTop                       - skepStdWijmo.flexGrid.addRowTop(fg1);
                     addRowWithParam                 - skepStdWijmo.flexGrid.addRowWithParam(fg1, param);
                     addRowWithParamTop              - skepStdWijmo.flexGrid.addRowWithParamTop(fg1, param);
                     delRow                          - skepStdWijmo.flexGrid.delRow(fg1);
                     delRows                         - skepStdWijmo.flexGrid.delRows(fg1);
                     isAddedRow                      - skepStdWijmo.flexGrid.isAddedRow(e.getRow())
                     isEditedRow                     - skepStdWijmo.flexGrid.isEditedRow(e.getRow())
                     rowMoveUp                       - skepStdWijmo.flexGrid.rowMoveUp(fg1)
                     rowMoveDown                     - skepStdWijmo.flexGrid.rowMoveDown(fg1)
        updateSortOrder                 - skepStdWijmo.flexGrid.updateSortOrder(fg1)

           ChangedItems
                     getChangedItems                 - skepStdWijmo.flexGrid.getChangedItems(fg1)
                     getChangedItemsJson             - skepStdWijmo.flexGrid.getChangedItemsJson(fg1)
                     getChangedItemsExists           - skepStdWijmo.flexGrid.getChangedItemsExists(savedItems)
                     getItemAdded                    - skepStdWijmo.flexGrid.getItemAdded(fg1)
                     getItemEdited                   - skepStdWijmo.flexGrid.getItemEdited(fg1)
                     getItemDeleted                  - skepStdWijmo.flexGrid.getItemDeleted(fg1)
                     getCurrentItemJson              - skepStdWijmo.flexGrid.getCurrentItemJson(fg1)
                     changedItemsCount               - skepStdWijmo.flexGrid.changedItemsCount(fg1)
                     checkChangedItem                - skepStdWijmo.flexGrid.checkChangedItem(fg1)

           Duplicate Check
                     getColumnDuplCheck              - skepStdWijmo.flexGrid.getColumnDuplCheck(fg1)
                     checkDupData                    - skepStdWijmo.flexGrid.checkDupData(fg1, arr).then(function(result) {});

           Excel Export
                     excelExport                     - skepStdWijmo.flexGrid.excelExport(fg1, 'CommonCodeMgmt-CDCL');
                     excelExportCb

           ETC
                     ctxMenu
                     columnGroup
# SKEP STD - Wijmo Custom Function - End


* 4. Edit Control
    readOnlyRowList
    rowInCellEditableList
    allowEditingCell
    wijmo.grid._EditHandler.prototype._allowEdit
    wijmo.grid.FlexGrid.prototype.allowEditing (allowEditing)
*/













// 1. skepWijmo Object 생성
const skepStdWijmo = new Object();



// 2. 라이센스 적용
if (typeof wijmo != 'undefined') {
    if (document.location.host == "ecms.skepoplant.com" || document.location.host == "ecms.skepoplant.com" ) {
            wijmo.setLicenseKey("ecms.skepoplant.com,924429437256628#B0lCjlNHbhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TPBx4Q7xGc5dDVSB5UPlVe8ZUeI3SeXh4KJRDZwp5ZStWUY3SN7tSOwEFTDhnSRpWc6N6R6VnSuh7UoFmTld7dMhVSGl4MTV7cxI5YxcGNi3SOBJDaDxUTnR5SwV4ZRJDcZRGTihFMrQVN9kTO6VndHRmYIBTciJ6NN9Ue85mdipUV4cDNqR4R4MjcYRDZ6YGdMhDcPZFa644LyYncYRTVSJ4UjVUYyMmRzJUY4N4cXFjMv2WR5AnUCZGcFdWTJhkcDFmenRVdykHewQzaCd5UxdGO6pVaQdnS98mYwY4YClDOrRlQ6NzTYRnQ986dxkWOBVjYo9mVJdFM9IXTMR6Y6wkZ6dVczNDZTlXZH5WWmlHcX36dGRHe6FEWu9kRy2SNRxEMEdFUhFkSGtENZVVNuJGMY5kTI3Sa7dVTHJ7LH3UbjRzLjVDNshXRZhXRsVUMLtCNoZlViojITJCLiQTQFZUQyE4NiojIIJCL5MTMzITN7IzM0IicfJye&Qf35VfikEMyIlI0IyQiwiIu3Waz9WZ4hXRgACdlVGaThXZsZEIv5mapdlI0IiTisHL3JSNJ9UUiojIDJCLi86bpNnblRHeFBCIyV6dllmV4J7bwVmUg2Wbql6ViojIOJyes4nILdDOIJiOiMkIsIibvl6cuVGd8VEIgc7bSlGdsVXTg2Wbql6ViojIOJyes4nI4YkNEJiOiMkIsIibvl6cuVGd8VEIgAVQM3EIg2Wbql6ViojIOJyes4nIzMEMCJiOiMkIsISZy36Qg2Wbql6ViojIOJyes4nIVhzNBJiOiMkIsIibvl6cuVGd8VEIgQnchh6QsFWaj9WYulmRg2Wbql6ViojIOJyebpjIkJHUiwiIwADMwgDMgITM4AzMyAjMiojI4J7QiwiIt36YuQnbhxGcvNWZrNnLz56YlJiOiMXbEJCLigritzpnrzIltTZvsD9lsTbnsDIvsTqisD9lsLiOiEmTDJCLigjM6YTNyczM4kjM4QjM9IiOiQWSiwSfdtlOicGbmJCLiEjdyIDMyIiOizXi2");
        }

}

$(function() {
    try {
        if (typeof wijmo != 'undefined') {
            try {
                setTimeout(function() {
                    $("div:contains('Wijmo Evaluation')").remove();
                    $("div:contains('Wijmo License')").remove();
                    $("div:contains('Wijmo 평가 버전')").remove();
                    $("div:contains('Wijmo 라이선스')").remove();
                }, 250);
            } catch(e) {
                console.log(e);
            }
        }
        if(typeof onLoad == "function") onLoad();
    } catch(e) {
        console.log(e);
    }
});
//라이센스 적용 - END




// 3. skepStdWijmo.flexGrid
skepStdWijmo.flexGrid = {

    // Wijmo FlexGrid Init
    // Ex.
    // let fg1 = skepStdWijmo.flexgrid.init('#fg1', { ... });
    init: function (id, options) {

        var fg = new wijmo.grid.FlexGrid(id, options);

        //FlexGrid Options
            /* Sorting, Column Resizing */
            fg.showSort = true;
            //fg.allowSorting = false;
            fg.deferResizing = true;
            fg.autoGenerateColumns = false;

            /* TODO */
            //fg.allowMerging = 'ColumnHeaders';
            fg.showMarquee = true;

            /* Only column header cells are displayed. */
            /* https://developer.mescius.com/wijmo/api/enums/wijmo_grid.headersvisibility.html */
            fg.headersVisibility = 1;

            /* Collection View */
            fg.itemsSource = new wijmo.collections.CollectionView([]);
            fg.collectionView.trackChanges = true;

            /* Row DefaultSize */
            fg.rows.defaultSize = 26;
            fg.columnHeaders.rows.defaultSize = 26;

            /* Using Tab Key */
            /* https://developer.mescius.com/wijmo/api/enums/wijmo_grid.selectionmode.html */
            fg.keyActionTab = 'CycleEditable' ;
            fg.selectionMode = "MultiRange";

            /* Column Required Default Setting  */
            fg.columns.forEach(function(col) {
                if (col.isRequired == null) col.isRequired = false
            });
            /* Read Only (All) */
            //if (_menuAuth != "W" ) fg.isReadOnly = true; --TODO
            /* Check Columns */
            //fg.checkCols = fg.columns.filter(function(col) {return col.dataType==3});
            
        //End FlexGrid Options

        // fg.itemFormatter
        fg.itemFormatter = function(panel, row, col, cell) {

            if (panel.cellType == 1) {
                /**
                 * Editable Cell Background Color
                 */
                if (fg.canEditCell(row, col)) {
                    wijmo.toggleClass(cell, 'fgEditableCell',  true);
                }
            }
        }

        // fg.findRow
        fg.findRow = function (key, value) {

            for (var t = 0; t < this.rows.length; t++)
                if (this.rows[t].dataItem[key] == value) return t;
            return -1

        };

        // fg.formatItem.addHandler
        /*  wijmo.CellType (e.panel.cellType)
         *    0: "None"
         *    1: "Cell"
         *    2: "ColumnHeader"
         *    3: "RowHeader"
         *    4: "TopLeft"
         *    5: "ColumnFooter"
         *    6: "BottomLeft"
         *      https://developer.mescius.com/wijmo/api/enums/wijmo_grid.celltype.html
         */
        fg.formatItem.addHandler(function (fg, e) {
            // console.log("formatItem");
            if (e.panel.cellType == 1) {

            } else if (e.panel.cellType == 2) {
                /**
                 * Header Align Center
                 */
                wijmo.toggleClass(e.cell, "flex", true)
                wijmo.toggleClass(e.cell, "wj-align-center", true)

            } else if (e.panel.cellType == 3) {

            }
        })


        // FlexGrid Event - TODO
        fg.beginningEdit.addHandler(function(fg, e) {
            console.log("beginningEdit");
            //if (_menuAuth != "W") e.cancel = true;

            // Control CheckBox는 itemsEdit List에서 제외
            // if (fg.getColumn(e.col).binding == "C") {
            //     if (fg._cv.trackChanges)  fg._cv.trackChanges = false;
            // } else {
            //     if (!fg._cv.trackChanges)  fg._cv.trackChanges = true;
            // }
        });
        // fg.cellEditEnding.addHandler(function(fg, e) {
        //     if (!fg._cv.trackChanges)  fg._cv.trackChanges = true;
        // });
        // fg.rowEditEnded.addHandler(function(fg, e) {
        //     if (!fg._cv.trackChanges)  fg._cv.trackChanges = true;
        // });
        // fg.pastedCell.addHandler(function(fg, e) {
        //     console.log("pastedCell");
        // });
        // fg.itemsSourceChanged.addHandler(function (fg, e) {
        //     console.log("itemsSourceChanged");
        // });
        // fg.rowAdded.addHandler(function (fg, e) {
        //     console.log("rowAdded");
        // });
        fg.loadedRows.addHandler(function (fg, e) {
            skepStdWijmo.flexGrid.updateStatusbar(fg);
        });
        // fg.deletingRow.addHandler(function (fg, e) {
        //     console.log("deletingRow");
        // });
        fg.deletedRow.addHandler(function (fg, e) {
            skepStdWijmo.flexGrid.updateStatusbar(fg);
        });
        // fg.pastingCell.addHandler(function (fg, e) {
            // console.log("pastingCell");
            //if (_menuAuth != "W") e.cancel = true;
        // });
        // fg.updatedLayout.addHandler(function (fg, e) {
        //     console.log("updatedLayout");
        //     setCheckCols()
        // });
        // fg.checkCols = [];
        // setCheckCols();
        // function setCheckCols(items) {
        //     fg.checkCols = []
        //     fg.columns.forEach(function(column) {
        //         if (column.dataType == 3) fg.checkCols.push(column.binding);
        //     });
        // }

        skepStdWijmo.flexGrid.columnPicker(fg);
        skepStdWijmo.flexGrid.statusbar(fg);
        skepStdWijmo.flexGrid.updateStatusbar(fg);
        skepStdWijmo.flexGrid.ctxMenu(fg);

       // FlexGrid Event - End



        /* Collection View - handler*/
        // fg._cv.sourceCollectionChanged.addHandler - TODO (WPCS와 비교 필요)
        // fg._cv.sourceCollectionChanged.addHandler(function (cv, e) {
        //     console.log("sourceCollectionChanged");
        //     if (fg.checkCols.length) {
        //         fg.deferUpdate(function() {
        //             $(fg._cv.items).each(function(i, item) {
        //                 fg.checkCols.forEach(function(col) {
        //                     //TODO
        //                     //item[col.binding] = (item[col.binding]=="Y")?true:false;
        //                 })
        //             });
        //         });
        //     }
        // });

        /* Add Row 초기값  */
//        fg._cv.collectionChanged.addHandler(function (cv, e) {
//            console.log("collectionChanged");
//            if (cv.currentAddItem) {
//                e.item.newItem = true;
//                if (fg.getColumn("C")) e.item.C = false;
//            }
//        });

        // setSubItemRowid
        /*
        function setSubItemRowid(items) {

            items.forEach(function(item) {
                item.rowId = dhx.newId();
                if (item[fg.childItemsPath]) {
                    setSubItemRowid(item[fg.childItemsPath]);
                }
            });
        }

        // Header Checkbox Event
        fg.hostElement.addEventListener('change', function(e) {
            if (e.target.id == "CHK_SEL") {
                if (_menuAuth != "W" ) return;
                fg.deferUpdate(function() {
                    fg._cv.items.forEach(function(item) {
                        item.C = e.target.checked;
                    });
                });
            }
        });
        */

        return fg;

    }
    // Wijmo FlexGrid Init - END

    ,statusbar: function(fg) {
        const target = fg.hostElement;
        let el = [];

        el[0] = document.createElement('div');
        el[0].className = 'grid-statusbar';
        el[1] = document.createElement('div');
        el[1].className = 'grid-statusbar-text';

        el[2] = document.createElement('div');
        el[2].className = 'grid-more';
        el[3] = document.createElement('button');
        el[3].className = 'grid-more__button';
        el[3].onclick = function() {
            if(el[2].classList.contains('is-open')){
                el[2].classList.remove('is-open');
            }else{
                el[2].classList.add('is-open');
            }
        }
        el[4] = document.createElement('i');
        el[4].className = 'ico__more--gray-700';

        el[5] = document.createElement('ul');
        el[6] = document.createElement('li');
        el[6].innerHTML = 'Row Selection Mode';
        el[6].onclick = function() {
            fg.selectionMode = "ListBox";
            fg.showMarquee = false;
        }
        el[7] = document.createElement('li');
        el[7].innerHTML = 'Column Selection Mode';
        el[7].style.paddingBottom = '10px';
        el[7].onclick = function() {
            fg.selectionMode = "MultiRange";
            fg.showMarquee = true;
        }

        el[8] = document.createElement('li');
        el[8].style.borderTop = '1px dotted var(--color-gray-400)';
        el[8].innerHTML = 'Column Picker';
        el[8].onclick = function() {
            let host = fg.columnPicker.hostElement;
            const columnPickerRef = fg.hostElement.querySelector('.grid-more');
            if (!host.offsetHeight) {
                wijmo.showPopup(host, columnPickerRef, 1);
                fg.columnPicker.focus();
            }
        }
        el[9] = document.createElement('li');
        el[9].innerHTML = 'Toggle Filter';
        el[9].onclick = function() {
            skepStdWijmo.flexGrid.toggleFilter(fg);
        }

        el[0].appendChild(el[1]);
        el[0].appendChild(el[2]);
        el[2].appendChild(el[3]);
        el[3].appendChild(el[4]);
        el[2].appendChild(el[5]);
        el[5].appendChild(el[6]);
        el[5].appendChild(el[7]);
        el[5].appendChild(el[8]);
        el[5].appendChild(el[9]);

        target.appendChild(el[0]);
        
        fg.statusbar = el[1];
    }

    ,updateStatusbar : function(fg) {
        if (fg.statusbar) {
            if (fg.allowAddNew) {
                fg.statusbar.innerText = "Result : "+wijmo.Globalize.format(fg.rows.length-1 ,'n');
            } else {
                fg.statusbar.innerText = "Result : "+wijmo.Globalize.format(fg.rows.length ,'n');
            }
        }
    }


    // SKEP STD - Wijmo Custom Function

    ////Filter
    /**
     * Grid Header Filter - skepStdWijmo.flexGrid.filter(fg1);
     */
    ,filter : function(fg) {

        fg.filter = new wijmo.grid.filter.FlexGridFilter(fg);
        fg.filter.showFilterIcons = true;
        fg.filter.showSortButtons = true;

        var arr = [];
        fg.columns.forEach(function(c)  {
            if(c.binding != "C") arr.push(c.binding);
        });

        fg.filter.filterColumns = arr;
    }
    /**
     * Toggle Filter - skepStdWijmo.flexGrid.toggleFilter(fg1);
     */
    ,toggleFilter : function(fg) {

        if (fg.filter instanceof wijmo.grid.filter.FlexGridFilter) {
            fg.filter.showFilterIcons = !fg.filter.showFilterIcons;
        }
   }
    /**
     * Grid Header Column Picker - skepStdWijmo.flexGrid.columnPicker(fg1);
     */
    ,columnPicker : function (fg) {

        $(fg.hostElement).before("<div class='column-picker' style='display:none;'></div>");

        fg.columnPicker = new wijmo.input.ListBox(fg.hostElement.previousSibling, {
            itemsSource: fg.columns,
            checkedMemberPath: 'visible',
            displayMemberPath: 'header',
            lostFocus: function() {
                wijmo.hidePopup(fg.columnPicker.hostElement);
            }
        });

    }
    /**
     * toggleColumnPicker - skepStdWijmo.flexGrid.toggleColumnPicker(fg, this, id);
     * Header Column 선택 가능
     */
    ,toggleColumnPicker : function(fg, toolbar, id) {

        if (fg.columnPicker instanceof wijmo.input.ListBox) {
            var btn  = eval("toolbar.objPull." + toolbar.idPrefix + id);
            if (btn.obj) {
                wijmo.showPopup(fg.columnPicker.hostElement, btn.obj, false, true, false);
                fg.columnPicker.focus();
            }
        }
    }
    ////Filter - End

    ////Checker
    /**
     * rowChecker - skepStdWijmo.flexGrid.rowChecker(fg1);
     */
    ,rowChecker: function (fg) {

        fg.headersVisibility = 3;

        fg.selector = new wijmo.grid.selector.Selector(fg);
        fg.selector.column = fg.rowHeaders.columns[0];

    }
    /**
     * colChecker - skepStdWijmo.flexGrid.colChecker(fg1, colName);
     */
    ,colChecker: function (fg, colName) {
        const row = fg.getColumn(colName);
        const opt = { showCheckAll: !row.isReadOnly };
        
        new wijmo.grid.selector.BooleanChecker(row, opt);
    }
    /**
     * getCheckedRow - skepStdWijmo.flexGrid.getCheckedRow(fg1);
     */
    ,getCheckedRow: function (fg) {

        var rows = [];
        if (fg.headersVisibility == 3) {
            fg.rows.forEach(function (row) {
                if (row.isSelected) rows.push(row);
            });
        }
        return rows;
    }
    // ,setCheckColsVal : function(fg, item) {

    //     if (fg.checkCols.length > 0) {
    //         Object.keys(item).forEach(function(key) {
    //             if (fg.checkCols.indexOf(key) > -1) {
    //                 item[key] = (item[key]==true)?"Y":"N";
    //             }
    //         });
    //     }
    //     //return item;

    // }
    ////Checker - End

    ////Row Control --> Add / Delete / Moveup / MoveDown
    /**
     * addRow - skepStdWijmo.flexGrid.addRow(fg1);
     */
    ,addRow: function (fg) {

        // if (_menuAuth != "W") return; --TODO
        fg._cv.addNew();
        fg.onRowAdded(new wijmo.grid.CellRangeEventArgs(fg.cells, fg.selection));
        fg._cv.commitNew();

    }
    /**
     * addRowWithFilter - skepStdWijmo.flexGrid.addRow(fg1);
     */
    ,addRowWithFilter: function (fg) {

        // if (_menuAuth != "W") return; --TODO
        //fg.filter.clear();
        fg._cv.refreshOnEdit = false;
        fg._cv.addNew();
        fg.onRowAdded(new wijmo.grid.CellRangeEventArgs(fg.cells, fg.selection));
        fg._cv.commitNew();
    }  
    /**
     * addRowSelected - skepStdWijmo.flexGrid.addRowSelected(fg1);
     */
    ,addRowSelected : function(fg) {

        // if (_menuAuth != "W") return; --TODO
        //var newItem = {newItem:true};
        var newItem = {};
        fg._cv.sourceCollection.splice(fg.selection.row + 1, 0, newItem);
        fg._cv.itemsAdded.push(newItem);
        fg._cv.refresh();
        fg._cv.moveCurrentToPosition(fg.selection.row + 1);

    }
    /**
     * addRowTop - skepStdWijmo.flexGrid.addRowTop(fg1);
     */
    ,addRowTop: function (fg) {

        // if (_menuAuth != "W") return; --TODO
        //var newItem = {newItem:true, C:false};
        var newItem = {};
        fg._cv.sourceCollection.splice(0, 0, newItem);
        fg._cv.itemsAdded.push(newItem);
        fg._cv.refresh();
        fg._cv.moveCurrentToPosition(0);

    },
    /**
     * addRowWithParam - skepStdWijmo.flexGrid.addRowWithParam(fg1, param);
     */
    addRowWithParam: function (fg, param) {

        fg._cv.sourceCollection.splice(fg.itemsSource.sourceCollection.length, 0, param);
        fg._cv.itemsAdded.push(param);
        fg._cv.refresh();
        fg._cv.moveCurrentToLast();
    },
    /**
     * addRowWithParamTop - skepStdWijmo.flexGrid.addRowWithParamTop(fg1, param);
     */
    addRowWithParamTop: function (fg, param) {

        fg._cv.sourceCollection.splice(0, 0, param);
        fg._cv.itemsAdded.push(param);
        fg._cv.refresh();
        fg._cv.moveCurrentToPosition(0);
    }
    /**
     * delRow - skepStdWijmo.flexGrid.delRow(fg1);
     */
    ,delRow: function (row) {

        var fg = row.grid;
        var g = new wijmo.grid.CellRange();
        g.setRange(row.index, -1);

        var c = new wijmo.grid.CellRangeEventArgs(fg.cells, g);

        fg.onDeletingRow(c);
        fg._cv.remove(row.dataItem);
        fg.onDeletedRow(c);

    }
    /**
     * delRows - skepStdWijmo.flexGrid.delRows(fg1);
     */
    ,delRows: function (fg) {

        var dRows = this.getCheckedRow(fg);
        dRows.forEach(function (row) {
           skepStdWijmo.flexGrid.delRow(row);
       });

    }
    /**
     * isAddedRow - skepStdWijmo.flexGrid.isAddedRow(e.getRow())
     */
    ,isAddedRow: function (row) {

        return ($.inArray(row.dataItem, row.grid._cv.itemsAdded)==-1)?false:true;

    }
    /**
     * isEditedRow - skepStdWijmo.flexGrid.isEditedRow(e.getRow())
     */
    ,isEditedRow: function (row) {

        return ($.inArray(row.dataItem, row.grid._cv.itemsEdited)==-1)?false:true;

    }
    /**
     * rowMoveUp
     *      - skepStdWijmo.flexGrid.rowMoveUp(fg1)
     *      - updateSortOrder(fg1);
     */
    ,rowMoveUp : function(fg) {

        const selectedRows = fg.selectedRows;
        const arr = fg.itemsSource.sourceCollection;

        for(const row of selectedRows){
            const curIdx = row.index;
            const item = arr[curIdx];

            if(curIdx < 1 || fg.rows[curIdx-1]?.isSelected) continue;

            fg.itemsSource.deferUpdate(() => {
                const toIdx = curIdx - 1;
                arr.splice(curIdx, 1);
                arr.splice(toIdx, 0, item);
                fg.itemsSource.moveCurrentToPosition(toIdx);
            });
        }
    }
    /**
     * rowMoveDown
     *      - skepStdWijmo.flexGrid.rowMoveDown(fg1)
     *      - updateSortOrder(fg1);
     */
    ,rowMoveDown : function(fg) {

        const selectedRows = fg.selectedRows.reverse();
        const arr = fg.itemsSource.sourceCollection;

        for(const row of selectedRows){
            const curIdx = row.index;
            const item = arr[curIdx];

            if(curIdx >= arr.length || fg.rows[curIdx+1]?.isSelected) continue;

            fg.itemsSource.deferUpdate(() => {
                const toIdx = curIdx + 1;
                arr.splice(curIdx, 1);
                arr.splice(toIdx, 0, item);
                fg.itemsSource.moveCurrentToPosition(toIdx);
            });
        }

    }
    // Ex) updateSortOrder func.
    ,updateSortOrder : function(fg) {

        return fg.itemsSource.items.map((item,idx)=> {
            return {
                ...item, order: idx
            }
        });
    }
    ////Row Control --> Add / Delete / Moveup / MoveDown - End



    ////ChangedItems
    /**
     * getChangedItems - skepStdWijmo.flexGrid.getChangedItems(fg1)
     * Ex)
     * let saveItem;
     * saveItem = skepStdWijmo.flexGrid.getChangedItems(fg1);
     * let jsonObject = {
     *      items : JSON.stringify(saveItem)
     * }
     * skepStdWijmo.postAjax(url, jsonObject ,function(res) {}
     */
    ,getChangedItems: function (fg) {

        return {
            //itemsFull : fg._cv.items.map(function(arr){ return arr}),
            itemsAdded : fg._cv.itemsAdded.map(function(arr){ return arr}),
            itemsEdited: fg._cv.itemsEdited.map(function(arr){ return arr}),
            itemsRemoved : fg._cv.itemsRemoved.map(function(arr){ return arr})
        }

    }
    /**
     * getChangedItemsJson - skepStdWijmo.flexGrid.getChangedItemsJson(fg1)
     */
    ,getChangedItemsJson: function (fg) {
        return JSON.stringify(this.getChangedItems(fg));
    }
    /**
     * getChangedItemsExists - skepStdWijmo.flexGrid.getChangedItemsExists(savedItems)
     */
    ,getChangedItemsExists: function (savedItems){
        let addCount = savedItems.itemsAdded.length;
        let editedCount = savedItems.itemsEdited.length;
        let romovedCount = savedItems.itemsRemoved.length;
        if( (addCount + editedCount + romovedCount) > 0){
            return true
        }else {
            return false;
        }
    }
    /**
     * getItemAdded - skepStdWijmo.flexGrid.getItemAdded(fg1)
     */
    ,getItemAdded: function(fg) {
        return fg._cv.itemsAdded.map(function(item) { return item })
    }
    /**
     * getItemEdited - skepStdWijmo.flexGrid.getItemEdited(fg1)
     */
    ,getItemEdited: function(fg) {
        return fg._cv.itemsEdited.map(function(item){ return item })
    }
    /**
     * getItemDeleted - skepStdWijmo.flexGrid.getItemDeleted(fg1)
     */
    ,getItemDeleted: function(fg) {
        return fg._cv.itemsRemoved.map(function(item){ return item })
    }
    /**
     * getCurrentItemJson - skepStdWijmo.flexGrid.getCurrentItemJson(fg1)
     */
    ,getCurrentItemJson: function (fg) {
        return JSON.parse(JSON.stringify(fg.collectionView.currentItem));
    }
    //--TODO : WPCS Added
    /**
     * changedItemsCount - skepStdWijmo.flexGrid.changedItemsCount(fg1)
     */
    ,changedItemsCount : function(fg) {

        if (!fg._cv) {
            return 0;
        } else {
            return fg._cv.itemsEdited.length + fg._cv.itemsAdded.length + fg._cv.itemsRemoved.length;
        }

    }
    /**
     * checkChangedItem - skepStdWijmo.flexGrid.checkChangedItem(fg1)
     */
    ,checkChangedItem : function(fg) {

        return new Promise(function(resolve, reject) {
            if (skepStdWijmo.flexGrid.changedItemsCount(fg) > 0) {
                skep.confirm(skep.msg.fg.changedItem, function(result) {
                    resolve(result);
                });
            } else {
                resolve(true);
            }
        });

    }
    ////ChangedItems - END





    ////Duplicate Check
    /**
     * getColumnDuplCheck - skepStdWijmo.flexGrid.getColumnDuplCheck(fg1)
     * Ex)
     * cellEditEnded: function ( s, e ) {
     *      skepStdWijmo.flexGrid.getColumnDuplCheck(fg1, s, e, 'cdCl');
     * }
     */
    ,getColumnDuplCheck: function (fg, s, e, colb) {
        let col = s.columns[e.col];
        if(col.binding == colb) {
           let inputValue = s.getCellData(e.row, e.col);

            let src = fg._cv.sourceCollection;
            let allSameId = src.filter((c) => c[colb] === inputValue);
            if (allSameId.length > 1) {
                s.setCellData(e.row, e.col, null);
                //return skep.error("This Cell Data is duplicated");
            }
        }
    }
    /**
     *
     * Check Grid Duplicated Row     *
     * Return Duplicated Rows Number Arrary
     * checkDupData -
     * Ex)
            var arr = ["CWA_CD", "SUB_CWA_CD", "ROOM_GRP_CD", "ROOM_NO"];
            skepStdWijmo.flexGrid.checkDupData(fg1, arr).then(function(result) {
                if (!result) ajaxSave(fg1);
            });
     */
    ,checkDupData : function(fg, dupCheckCol) {

        return new Promise(function(resolve, reject) {
            if (!fg._cv) resolve(false);
            if (!dupCheckCol instanceof Array) resolve(false);
            fg.dupList = [];
            fg._cv.items.forEach(function(a, i) {

                var f = false;
                fg._cv.items.forEach(function(b, j) {
                    if (i < j) {
                        var colEqCnt = dupCheckCol.reduce(function(i, col) {
                            if ((a[col]!=null && b[col]!=null) && a[col] == b[col]) return i+1;
                        }, 0);
                        if (dupCheckCol.length == colEqCnt)  {
                            f=true;
                            if (fg.dupList.indexOf(j) == -1) fg.dupList.push(j);
                        }
                    }
                });

                if(f) {
                    if (fg.dupList.indexOf(i) == -1) fg.dupList.push(i);
                }
                fg.rows[i].isSelected = false;

            });

            fg.dupList.forEach(function(row) {
                if (fg instanceof wijmo.grid.sheet.FlexSheet) {
                    fg.rows[row+1].isSelected = true;
                } else  {
                    fg.rows[row].isSelected = true;
                }
            });

            if (fg.dupList.length > 0) {
                skep.error(skep.msg.fg.checkDupData, function() {
                    resolve(fg.dupList.length > 0);
                });
            } else {
                resolve(false);
            }
        });
    }
    ////Duplicate Check - End



    //// Excel Export
    /**
     * excelExport
     * Ex)
     * - skepStdWijmo.flexGrid.excelExport(fg1, 'CommonCodeMgmt-CDCL');
     * - skepStdWijmo.flexGrid.excelExport(fg1, 'CommonCodeMgmt-CDCL', false);
     */
    ,excelExport : function(fg, fileNm, header) {

        var fn = fileNm||'ExcelExport';
            fn = fn + "_"+ Date.now().toString() + ".xlsx"

        wijmo.grid.xlsx.FlexGridXlsxConverter.saveAsync(
            fg
           ,{ includeColumnHeaders: (header==undefined)?true:header}
           ,fn
        );

    }
    /**
     * excelExport
     * Ex)
        skepStdWijmo.flexGrid.excelExportCb(fg, "Standard WBS " + wbsVal[getWbsLevel()].codeCd, function() {
            mainLayout.progressOff();
        });
    */
    ,excelExportCb : function(fg, fileNm, cb) {

        fileNm||"ExcelExport"
        fileNm +=  "_"+ Date.now().toString() + ".xlsx"

        wijmo.grid.xlsx.FlexGridXlsxConverter.saveAsync(
            fg
            ,{
                includeColumnHeaders: true
            }
            ,fileNm
            ,function (base64) {
                if (cb) { cb(base64) }
            }
            ,function (reason) {
                skep.error("Excel Export Error!");
                console.error('Wijmo Excel Export Error!\n' + reason);
                if (cb) { cb() }
            }
        );

    }
    //// Excel Export - End


    //// ETC
    /**
    * Context Menu
    */
    ,ctxMenu : function(fg) {

        const itemsSource = [
            { header: "Frozen Column", cmd: 1 },
            { header: "Frozen Row", cmd: 2 },
            { header: "Frozen Release", cmd: 3 },
            { header: "-" },
            { header: "Go To Top", cmd: 4 },
            { header: "Go To Last", cmd: 5 },
        ];

        fg.ctxMenu = new wijmo.input.Menu(document.createElement('ctxMenu'), {
            displayMemberPath: 'header',
            subItemsPath: 'items',
            commandParameterPath: 'cmd',
            itemsSource: itemsSource,
            closeOnLeave: true,
            command: {
                // execute menu commands
                executeCommand: (cmd) => {
                    switch (cmd) {
                        case 1:
                            fg.frozenColumns = hitTest.col + 1;
                            break;
                        case 2:
                            fg.frozenRows = ((fg.cells.viewRange.row2 - fg.cells.viewRange.row) > hitTest.row + 1) ? hitTest.row + 1 : 0;
                            break;
                        case 3:
                            fg.frozenColumns = 0;
                            fg.frozenRows = 0;
                            break;
                        case 4:
                            // fg._cv.moveCurrentToFirst();
                            fg.select(0, fg.selection._col2 === -1 ? 0 : fg.selection._col2);
                            break;
                        case 5:
                            // fg._cv.moveCurrentToLast();
                            fg.select(fg.rows.length, fg.selection._col2 === -1 ? 0 : fg.selection._col2);
                            break;
                    }
                    fg.refresh();
                    let sel = fg.selection, cell = fg.cells.getCellElement(sel.row, sel.col);
                    if (cell) {
                        cell.focus();
                    }
                }
            }
        });

        var hitTest;
        fg.hostElement.addEventListener('contextmenu', function(e) {
            if (fg.hitTest(e).panel == fg.cells) {
                hitTest = fg.hitTest(e);
                e.preventDefault();
                fg.ctxMenu.selectedIndex = -1;
                wijmo.showPopup(fg.ctxMenu.dropDown, e);
                fg.ctxMenu.dropDown.focus();
            }
        });

    }

    /**
    * @Deprecated
    *
    * wijmo-5-20191-615 -> wijmo-5.20193.646
    *
    *
    *
        var fg2 = new wijmo.grid.FlexGrid("#fg2", {

            autoGenerateColumns:false,
            columnGroups : [

                {header: 'Engineering', columns :[

                   {binding:'EE', header: 'EDPR', allowSorting: false, allowResizing: false, width: 170, align:'center', dataType:2, format:'p2'},
                   {binding:'ER', header: 'RPR', allowSorting: false, allowResizing: false, width: 170, align:'center', dataType:2, format:'p2'}

                ]},
                {header: 'Procurement', columns :[

                   {binding:'PR', header: 'RPR', allowSorting: false, allowResizing: false, width: 170, align:'center', dataType:2, format:'p2'},
                  {binding:'PP', header: 'PPR', allowSorting: false, allowResizing: false, width: 170, align:'center', dataType:2, format:'p2'}

                ]}

            ],
            itemsSource: []

        });
    *
    *
    */
    ,columnGroup : function(fg, columnGroupJson) {

        /* Column Settting */
        if (columnGroupJson) {
            /**
             * Create Header with Multi-Row(columnGroup)
             *
             * recursive call
             * @param {object} columnGroups
             * @param {int} rowCnt
             */
            var createColumnGroups = function(columnsData, rowCnt){

                if (rowCnt >= fg.columnHeaders.rows.length) {
                    var hRow = new wijmo.grid.Row();
                    hRow.allowMerging = true;
                    fg.columnHeaders.rows.splice(0, 0, hRow);
                }

                for (var i = 0; i < columnsData.length; i++) {
                    var group = columnsData[i];
                    if (!group.columns) {
                        var col = new wijmo.grid.Column();
                        for (var prop in group) {
                            col[prop] = group[prop];
                        }
                        fg.columns.push(col);
                    } else {
                        var colIndex = fg.columnHeaders.columns.length;
                        createColumnGroups(group.columns, rowCnt+1);
                        for (var j = colIndex; j < fg.columnHeaders.columns.length; j++) {
                            fg.columnHeaders.setCellData(rowCnt, j, group.header);
                        }
                    }
                }
            }

            createColumnGroups(columnGroupJson, 0);

            /**
             * Merged Column Header
             */
            if (fg.columnHeaders.viewRange.rowSpan > 1) {

                var colh = fg.columnHeaders;
                var bRow = fg.columnHeaders.viewRange.bottomRow;

                for (var c=0; c < colh.columns.length; c++) {
                    colh.columns[c].allowMerging = true;
                    for (var r = 0; r <= bRow -1 ; r++) {
                        if(!colh.getCellData(r, c)) {
                            colh.setCellData(r, c, colh.getCellData(bRow, c));
                        }
                    }
                }

                for (var c = 0; c < fg.topLeftCells.columns.length; c++) {
                    fg.topLeftCells.columns[c].allowMerging = true
                }
            }


        } //enf  if columnGroupJson

    }
    //// ETC - END




    // SKEP STD - Wijmo Custom Function - END

};
// 3. skepStdWijmo.flexGrid - END




// 4. Edit Control
// readOnlyRowList
function readOnlyRowList(panel, row, cell, rowList){
    if(rowList.find((e) => e == row) != null){
        panel._rows[row].isReadOnly = true;
    }else{
        wijmo.toggleClass(cell, 'fgEditableCell',  true);
        panel._rows[row].isReadOnly = false;
    }
}

// rowInCellEditableList
function rowInCellEditableList(row, col, cell, rowNum, colList){
    if(row == rowNum){
        if(colList.find((e) => e == col) != null){
            wijmo.toggleClass(cell, 'fgEditableCell', true);
        }else{
            wijmo.toggleClass(cell, 'fgEditableCell', false);
        }
    }
}

// allowEditingCell
function allowEditingCell(row, col, editCell){
    var isRowExist = false;
    var isColExist = false;

    for(var i=0 ; i < editCell.length; i++){
        if(editCell[i].rowNum == row){
            isRowExist = true;
        }
    }

    if(isRowExist){
        for(var j=0 ; j < editCell.length; j++){
            if( editCell[j].colNum == col){
                isColExist = true;
            }
        }
        if(isColExist){
            return true;
        }else{
            return false;
        }
    }else{
        return null;
    }
}

// wijmo.grid._EditHandler.prototype._allowEdit
// wijmo.grid.FlexGrid.prototype.allowEditing (allowEditing)
if (wijmo != 'undefined') {
    /**
     * Wijmo Library 5.20212.812  - wijmo.grid.min.js
     * _allowEdit Custumize
     **/
    wijmo.grid._EditHandler.prototype._allowEdit = function (e, i) {
        var o = this._g;
        var r = o._getBindingColumn(o.cells, e, o.columns[i]);
        if (o.isReadOnly || o.selectionMode == wijmo.grid.SelectionMode.None) {

            return !1;
        }
        if (o.collectionView && !o.editableCollectionView) {

            return !1;
        }
        if (null != e) {
            if (e < 0 || e >= o.rows.length) {
                return !1;
            }
            var n = o.rows[e];

            //if (!n || n.isReadOnly || !n.isVisible) return !1;
            if (!n || n.isReadOnly || !n.isVisible){
                return !1;
            }else{
                if (o.allowEditing(e,i) ) {
                    return true;
                }else if(o.allowEditing(e,i) == false){
                    return false;
                }
            }
        }

        if (null != i) {
            if (i < 0 || i >= o.columns.length) return !1;
            var r = o._getBindingColumn(o.cells, e, o.columns[i]);
            //if (!r || r.isReadOnly || !r.isVisible) return !1;
            if (!r || r.isReadOnly || !r.isVisible){
                return !1;
            }else{
                if (o.allowEditing(e,i) ) {
                    return true;
                }else if(o.allowEditing(e,i) == false){
                    return false;
                }
            }
        }
        return !0;
    };

    /**
     *
     * Allow Editing Customize
     *
     * Parameter
     *  r : Row Index
     *  c : Col Index
     */

    wijmo.grid.FlexGrid.prototype.allowEditing = function (r, c) {
        return null;
    }

/*
    wijmo.grid.FlexGrid.prototype.allowEditingRow = function (r) {
        return null;
    }
    wijmo.grid.FlexGrid.prototype.allowEditingCell = function (c) {
        return null;
    }
*/

}

