/*
 * Copyright (C) 2011 Flamingo Project (http://www.cloudine.io).
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Ankus : Content based Similarity
 *
 * @cli hadoop jar ankus-core.jar ContentBasedSimilarity -input <IN> -output <OUT> -keyIndex 0 -indexList 1,2,3,4 -algorithmOption jaccard -delimiter '::' -subDelimiter '|'
 * @extends Flamingo2.view.designer.property._NODE_ALG
 * @author <a href="mailto:fharenheit@gmail.com">Byoung Gon, Kim</a>
 * @author <a href="mailto:myeongha.kim@cloudine.co.kr">Myeong Ha, Kim</a>
 * @see <a href="http://www.openankus.org/display/DOC/Flamingo2+Hadoop+Manager+Integration">Ankus Algorithm</a>
 */
Ext.ns('Flamingo2.view.designer.property.ankus');
Ext.define('Flamingo2.view.designer.property.ankus.ALG_ANKUS_CONTENT_SIM', {
    extend: 'Flamingo2.view.designer.property._NODE_ALG',
    alias: 'widget.ALG_ANKUS_CONTENT_SIM',

    requires: [
        'Flamingo2.view.designer.property._ConfigurationBrowserField',
        'Flamingo2.view.designer.property._BrowserField',
        'Flamingo2.view.designer.property._ColumnGrid',
        'Flamingo2.view.designer.property._DependencyGrid',
        'Flamingo2.view.designer.property._NameValueGrid',
        'Flamingo2.view.designer.property._KeyValueGrid',
        'Flamingo2.view.designer.property._EnvironmentGrid'
    ],

    width: 450,
    height: 320,

    items: [
        {
            title: message.msg('workflow.common.parameter'),
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 180
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: message.msg('workflow.dm.sim.algorithm'),
                    tooltip: message.msg('workflow.dm.sim.algorithm.detail'),
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'combo',
                            name: 'algorithmOption',
                            value: 'dice',
                            flex: 1,
                            forceSelection: true,
                            multiSelect: false,
                            disabled: false,
                            editable: false,
                            displayField: 'name',
                            valueField: 'value',
                            mode: 'local',
                            queryMode: 'local',
                            triggerAction: 'all',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['name', 'value', 'description'],
                                data: [
                                    {name: 'DICE COEFFICIENT', value: 'dice', description: 'DICE COEFFICIENT'},
                                    {name: 'JACCARD COEFFICIENT', value: 'jaccard', description: 'JACCARD COEFFICIENT'},
                                    {name: 'HAMMING DISTANCE', value: 'hamming', description: 'HAMMING DISTANCE'}
                                ]
                            })
                        }
                    ]
                },
                {
                    xtype: 'textfield',
                    fieldLabel: message.msg('workflow.dm.con.identifier.attr'),
                    name: 'keyIndex',
                    tooltip: message.msg('workflow.dm.con.identifier.attr.detail'),
                    vtype: 'numeric',
                    allowBlank: false
                },
                {
                    xtype: 'textfield',
                    name: 'indexList',
                    fieldLabel: message.msg('workflow.dm.index.list'),
                    tooltip: message.msg('workflow.dm.include.list'),
                    vtype: 'commaseperatednum',
                    allowBlank: false
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: message.msg('workflow.common.delimiter'),
                    tooltip: message.msg('workflow.common.delimiter.message'),
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'combo',
                                    name: 'delimiter',
                                    value: '::',
                                    flex: 1,
                                    forceSelection: true,
                                    multiSelect: false,
                                    editable: false,
                                    readOnly: this.readOnly,
                                    displayField: 'name',
                                    valueField: 'value',
                                    mode: 'local',
                                    queryMode: 'local',
                                    triggerAction: 'all',
                                    tpl: '<tpl for="."><div class="x-boundlist-item" data-qtip="{description}">{name}</div></tpl>',
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['name', 'value', 'description'],
                                        data: [
                                            {
                                                name: message.msg('workflow.common.delimiter.double.colon'),
                                                value: '::',
                                                description: '::'
                                            },
                                            {
                                                name: message.msg('workflow.common.delimiter.comma'),
                                                value: ',',
                                                description: ','
                                            },
                                            {
                                                name: message.msg('workflow.common.delimiter.pipe'),
                                                value: '|',
                                                description: '|'
                                            },
                                            {
                                                name: message.msg('workflow.common.delimiter.tab'),
                                                value: '\'\\t\'',
                                                description: '\'\\t\''
                                            },
                                            {
                                                name: message.msg('workflow.common.delimiter.blank'),
                                                value: '\'\\s\'',
                                                description: '\'\\s\''
                                            },
                                            {
                                                name: message.msg('workflow.common.delimiter.user.def'),
                                                value: 'CUSTOM',
                                                description: message.msg('workflow.common.delimiter.user.def')
                                            }
                                        ]
                                    }),
                                    listeners: {
                                        change: function (combo, newValue, oldValue, eOpts) {
                                            // 콤보 값에 따라 관련 textfield 를 enable | disable 처리한다.
                                            var customValueField = combo.nextSibling('textfield');
                                            if (newValue === 'CUSTOM') {
                                                customValueField.enable();
                                                customValueField.isValid();
                                            } else {
                                                customValueField.disable();
                                                if (newValue) {
                                                    customValueField.setValue(newValue);
                                                } else {
                                                    customValueField.setValue('::');
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'delimiterValue',
                                    vtype: 'exceptcommaspace',
                                    flex: 1,
                                    disabled: true,
                                    readOnly: this.readOnly,
                                    allowBlank: false,
                                    value: '::'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: message.msg('workflow.common.subdelimiter'),
                    tooltip: message.msg('workflow.common.delimiter.message'),
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'combo',
                                    name: 'subDelimiter',
                                    value: '|',
                                    flex: 1,
                                    forceSelection: true,
                                    multiSelect: false,
                                    editable: false,
                                    readOnly: this.readOnly,
                                    displayField: 'name',
                                    valueField: 'value',
                                    mode: 'local',
                                    queryMode: 'local',
                                    triggerAction: 'all',
                                    tpl: '<tpl for="."><div class="x-boundlist-item" data-qtip="{description}">{name}</div></tpl>',
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['name', 'value', 'description'],
                                        data: [
                                            {
                                                name: message.msg('workflow.common.delimiter.double.colon'),
                                                value: '::',
                                                description: '::'
                                            },
                                            {
                                                name: message.msg('workflow.common.delimiter.comma'),
                                                value: ',',
                                                description: ','
                                            },
                                            {
                                                name: message.msg('workflow.common.delimiter.pipe'),
                                                value: '|',
                                                description: '|'
                                            },
                                            {
                                                name: message.msg('workflow.common.delimiter.tab'),
                                                value: '\'\\t\'',
                                                description: '\'\\t\''
                                            },
                                            {
                                                name: message.msg('workflow.common.delimiter.blank'),
                                                value: '\'\\s\'',
                                                description: '\'\\s\''
                                            },
                                            {
                                                name: message.msg('workflow.common.delimiter.user.def'),
                                                value: 'CUSTOM',
                                                description: message.msg('workflow.common.delimiter.user.def')
                                            }
                                        ]
                                    }),
                                    listeners: {
                                        change: function (combo, newValue, oldValue, eOpts) {
                                            // 콤보 값에 따라 관련 textfield 를 enable | disable 처리한다.
                                            var customValueField = combo.nextSibling('textfield');
                                            if (newValue === 'CUSTOM') {
                                                customValueField.enable();
                                                customValueField.isValid();
                                            } else {
                                                customValueField.disable();
                                                if (newValue) {
                                                    customValueField.setValue(newValue);
                                                } else {
                                                    customValueField.setValue('|');
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'subDelimiterValue',
                                    vtype: 'exceptcommaspace',
                                    flex: 1,
                                    disabled: true,
                                    readOnly: this.readOnly,
                                    allowBlank: false,
                                    value: '|'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            title: message.msg('workflow.common.mapreduce'),
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 100
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'textfield',
                    name: 'jar',
                    fieldLabel: message.msg('workflow.common.mapreduce.jar'),
                    value: ANKUS.JAR,
                    disabledCls: 'disabled-plain',
                    readOnly: true
                },
                {
                    xtype: 'textfield',
                    name: 'driver',
                    fieldLabel: message.msg('workflow.common.mapreduce.driver'),
                    value: 'ContentBasedSimilarity',
                    disabledCls: 'disabled-plain',
                    readOnly: true
                }
            ]
        },
        {
            title: message.msg('workflow.common.inout.path'),
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 100
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                // Ankus MapReduce가 동작하는데 필요한 입력 경로를 지정한다.  이 경로는 N개 지정가능하다.
                {
                    xtype: '_inputGrid',
                    title: message.msg('workflow.common.input.path'),
                    flex: 1
                },
                // Ankus MapReduce가 동작하는데 필요한 출력 경로를 지정한다. 이 경로는 오직 1개만 지정가능하다.
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: message.msg('workflow.common.output.path'),
                    defaults: {
                        hideLabel: true,
                        margin: "5 0 0 0"  // Same as CSS ordering (top, right, bottom, left)
                    },
                    layout: 'hbox',
                    items: [
                        {
                            xtype: '_browserField',
                            name: 'output',
                            allowBlank: false,
                            readOnly: false,
                            flex: 1
                        }
                    ]
                }
            ]
        },
        {
            title: message.msg('workflow.common.hadoop.conf'),
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 100
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: message.msg('workflow.common.hadoop.conf.guide')
                },
                {
                    xtype: '_keyValueGrid',
                    flex: 1
                }
            ]
        },
        {
            title: message.msg('common.references'),
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 100
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="http://www.openankus.org/display/AN/3.6.1+Content+based+Similarity" target="_blank">Content based Similarity</a>'
                }
            ]
        }
    ],

    /**
     * UI 컴포넌트의 Key를 필터링한다.
     *
     * ex) 다음과 같이 필터를 설정할 수 있다.
     * propFilters: {
     *     // 추가할 프라퍼티
     *     add   : [
     *         {'test1': '1'},
     *         {'test2': '2'}
     *     ],
     *
     *     // 변경할 프라퍼티
     *     modify: [
     *         {'delimiterType': 'delimiterType2'},
     *         {'config': 'config2'}
     *     ],
     *
     *     // 삭제할 프라퍼티
     *     remove: ['script', 'metadata']
     * }
     */
    propFilters: {
        add: [],
        modify: [],
        remove: ['config']
    },

    /**
     * MapReduce의 커맨드 라인 파라미터를 수동으로 설정한다.
     * 커맨드 라인 파라미터는 Flamingo2 Workflow Engine에서 props.mapreduce를 Key로 꺼내어 구성한다.
     *
     * @param props UI 상에서 구성한 컴포넌트의 Key Value값
     */
    afterPropertySet: function (props) {
        props.mapreduce = {
            "driver": props.driver ? props.driver : '',
            "jar": props.jar ? props.jar : '',
            "confKey": props.hadoopKeys ? props.hadoopKeys : '',
            "confValue": props.hadoopValues ? props.hadoopValues : '',
            params: []
        };

        if (props.input) {
            props.mapreduce.params.push("-input", props.input);
        }

        if (props.output) {
            props.mapreduce.params.push("-output", props.output);
        }

        if (props.algorithmOption) {
            props.mapreduce.params.push("-algorithmOption", props.algorithmOption);
        }

        if (props.keyIndex) {
            props.mapreduce.params.push("-keyIndex", props.keyIndex);
        }

        if (props.indexList) {
            props.mapreduce.params.push("-indexList", props.indexList);
        }

        if (props.subDelimiter) {
            if (props.subDelimiter == 'CUSTOM') {
                props.mapreduce.params.push("-subDelimiter", props.subDelimiterValue);
            } else {
                props.mapreduce.params.push("-subDelimiter", props.subDelimiter);
            }
        }

        if (props.delimiter) {
            if (props.delimiter == 'CUSTOM') {
                props.mapreduce.params.push("-delimiter", props.delimiterValue);
            } else {
                props.mapreduce.params.push("-delimiter", props.delimiter);
            }
        }

        this.callParent(arguments);
    }
});