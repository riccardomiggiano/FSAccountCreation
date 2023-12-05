sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/ODataModel",
    "sap/ui/base/Object",
    'sap/m/MessageToast',
    'sap/m/MessageStrip',
    "sap/ui/core/Core",
    'sap/ui/core/library',
    
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/format/DateFormat',

    "sap/m/Dialog",
	"sap/m/Button",
	"sap/m/library",
	"sap/ui/core/library",
	"sap/m/Text",
],  
  
    
    function (JSONModel,ODataModel,Object,MessageToast,MessageStrip,oCore,library, Filter,FilterOperator,DateFormat,Dialog, Button, mobileLibrary, coreLibrary, Text ) {
        "use strict";

        let ButtonType = mobileLibrary.ButtonType;

		// shortcut for sap.m.DialogType
		let DialogType = mobileLibrary.DialogType;

		let ValueState = coreLibrary.ValueState;

        return Object.extend("servicemodel",{
            constructor: function (oView) {
                this.callerView = oView;
                this.NewViewModel = new JSONModel({
                    TipoRic: {},
                                    })
                this.callerView.getView().setModel(this.NewViewModel, 'NewViewModel');   
                this.ComboModel = new ODataModel("/sap/opu/odata/sap/ZFS_ACCOUNT_CREATION_SRV/", true);
                
            },
            getComboModel: function () {
               
                this.ComboModel.read('/Step1Set', {
                    success: oData => {
                        this.NewViewModel.setProperty('/TipoRic', oData.results);
                    },
                    error: e => {  
                        this.showErrorMessage(this.parseError(e));
                       
                    }
                });
                
            },
            onCreateRequest:function(){
                
                const oSocieta = this.callerView.byId("IdSoc").getSelectedKey();
                const oTipoRichiesta = this.callerView.byId("IdTipRic").getSelectedKey();
                const oDescrizioneRichiesta = this.callerView.byId("IdDescrRic").getValue();
                const RichiestaObj = {
                        Societa : oSocieta,
                        Tiporichiesta : oTipoRichiesta,
                        RichiestaDescr : oDescrizioneRichiesta
                };
                this.NewViewModel.setProperty("/Richiesta", RichiestaObj);
                const oRichiesta = this.NewViewModel.getProperty("/Richiesta");
                this.ComboModel.create('/RichiestaSet', oRichiesta ,{
                    success: oData => {
                        this.IdRichiesta = oData.Idrichiesta;
                        this.NewViewModel.setProperty("/Richiesta", oData);
                    },
                    error: e => {
                        this.showErrorMessage(this.parseError(e)); 
                        //this.showMsgStrip(e);
                       
                    }
                })
            },
            onRequestRequest:function(oIdRichiesta){
                const oRichiesta = this.NewViewModel.getProperty("/Richiesta");
                const oUtente = this.callerView.byId("IdUser").getValue();
                const oConto = this.callerView.byId("IdContoCoge").getValue();
                return new Promise( (resolve,reject) => {
                    this.ComboModel.callFunction('Richiedi', {
                        urlParameters: {
                            Idrichiesta: oIdRichiesta,
                            Utente:  oUtente,
                            Contocoge : oConto
                        },
                        success: oData => {
                                        resolve(oData);
                                    },
                        error: e => {  
                            this.showErrorMessage(this.parseError(e));
                        
                        }
                    });
                }) 
                
            },
            callAction:function(sAction, sIdRichiesta){

                return new Promise( (resolve,reject) => {
                    this.ComboModel.callFunction(sAction, {
                        urlParameters: {
                            Idrichiesta: sIdRichiesta,
                        },
                        success: oData => {
                            resolve(oData);
                        },
                        error: e => {
                            reject(e);
                            this.showErrorMessage(this.parseError(e));   
                        }
                    });
                })    
            },
            // onApprovesRequest:function(oIdRichiesta){

            //     return new Promise( (resolve,reject) => {
            //         this.ComboModel.callFunction('Approva', {
            //             urlParameters: {
            //                 Idrichiesta: oIdRichiesta,
            //             },
            //             success: oData => {
            //                 resolve(oData);
            //             },
            //             error: e => {
            //                 reject(e);
            //                 this.showErrorMessage(this.parseError(e));   
            //             }
            //         });
            //     })    
            // },
            // onDeleteRequest:function(oIdRichiesta){
            //     this.ComboModel.callFunction('Cancella', {
            //         urlParameters: {
            //             Idrichiesta: oIdRichiesta,
            //         },
            //         error: e => {  
            //             this.showErrorMessage(this.parseError(e));
                       
            //         }
            //     });
            // },
            // onRetryRequest:function(oIdRichiesta){
            //     this.ComboModel.callFunction('Riprova', {
            //         urlParameters: {
            //             Idrichiesta: oIdRichiesta,
            //         },
            //         error: e => {  
            //             this.showErrorMessage(this.parseError(e));
                       
            //         }
            //     });
            // },
            onRejectRequest:function(oIdRichiesta,sText){
                return new Promise( (resolve,reject) => {
                    this.ComboModel.callFunction('Rifiuta', {
                        urlParameters: {
                            Idrichiesta: oIdRichiesta,
                            Motivorifiuto: sText
                        },
                        success: oData => {
                            resolve(oData);
                        },
                        error: e => {  
                            this.showErrorMessage(this.parseError(e));
                        
                        }
                    });
                })     
            },
            ReadModel:function(newId){
                const that = this;
                //console.log("OK");
                return new Promise(function (resolve,reject) {

                    that.ComboModel.read( `/RichiestaSet${newId}`,{
                        success: oData => {
                            let oRichiesta = oData;
                            if(oData.Tiporichiesta === "01"){
                                oRichiesta.VisibleCoge = false;
                            }else{
                                oRichiesta.VisibleCoge = true;
                            }
                            //that.NewViewModel.setProperty("/Richiesta",oData);
                            resolve(oRichiesta);
                        },
                        error: e => {
                            reject(e);
                            this.showErrorMessage(this.parseError(e));   
                        }
                    })

                })
                
            },
            getLogs:function(IdRichiesta){

                return new Promise( (resolve, reject) => {

                    const filtri = [ new Filter( {
                            path : 'Richiesta',
                            operator : FilterOperator.EQ,
                            value1 : IdRichiesta
                        }
                    )]

                    this.ComboModel.read('/LogSet', {
                        filters : filtri,
                        success: oData => {
                            const results = oData.results.forEach(element => {
                                element.Type = element.MsgType === 'I' ? 'Information' : 
                                element.MsgType === 'E' ? 'Error' : element.MsgType === 'W' ? 'Warning' : 'Success' 
                            });
                            this.NewViewModel.setProperty('/Logs', oData.results);
                            resolve(oData.results)
                        },
                        error: e => {
                            
                            this.showErrorMessage(this.parseError(e)); 
                            reject(e)
                        }
                    });

                })

            },
            getHistory:function(IdRichiesta){



                const filtri = [ new Filter( {
                        path : 'IdRichiesta',
                        operator : FilterOperator.EQ,
                        value1 : IdRichiesta
                    }
                )]
                
                return new Promise( (resolve, reject) => {

                    this.ComboModel.read('/HistorySet', {
                        filters : filtri,
                        success: oData => {
                            let dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance();  
                            

                            let Testi = this.NewViewModel.getProperty('/History');

                            const HisStato00 = oData.results.find((e)=> e.StatoSuccessivo === '00');
                            if(HisStato00){
                            const DataNew00 = this.FormatData(HisStato00.DataOra);
                            Testi.testo00 = "La richiesta è stata creata in data " + DataNew00 + " da " + HisStato00.NomeUtente;
                            }

                            const HisStato10 = oData.results.find((e)=> e.StatoSuccessivo === '10');
                            if(HisStato10){
                            const DataNew01 = this.FormatData(HisStato10.DataOra);
                            Testi.testo10 = "La richiesta è stata richiesta in data " + DataNew01 + " da " + HisStato10.NomeUtente;
                            }

                            const HisStato20 = oData.results.find((e)=> e.StatoSuccessivo === '20');
                            if(HisStato20){
                            const DataNew02 = this.FormatData(HisStato20.DataOra);
                            Testi.testo20 = "La richiesta è stata approvata in data " + DataNew02 + " da " + HisStato20.NomeUtente;
                            }

                            const HisStato30 = oData.results.find((e)=> e.StatoSuccessivo === '30');
                            if(HisStato30){
                            const DataNew03 = this.FormatData(HisStato30.DataOra);
                            Testi.testo30 = "La richiesta è stata rifiutata in data " + DataNew03 + " da " + HisStato30.NomeUtente;
                            }

                            const HisStato40 = oData.results.find((e)=> e.StatoSuccessivo === '40');
                            if(HisStato40){
                            const DataNew04 = this.FormatData(HisStato40.DataOra);
                            Testi.testo40 = "La richiesta è stata attivata in data " + DataNew04;
                            }

                            const HisStato50 = oData.results.find((e)=> e.StatoSuccessivo === '50');
                            if(HisStato50){
                            const DataNew05 = this.FormatData(HisStato50.DataOra);
                            Testi.testo50 = "La richiesta si è conclusa in data " + DataNew05;
                            }

                            const HisStato60 = oData.results.find((e)=> e.StatoSuccessivo === '60');
                            if(HisStato60){
                            const DataNew06 = this.FormatData(HisStato60.DataOra);
                            Testi.testo60 = "L'eccezione è stata rimossa in data " + DataNew06;
                            }

                            const HisStato70 = oData.results.find((e)=> e.StatoSuccessivo === '70');
                            if(HisStato70){
                            const DataNew07 = this.FormatData(HisStato70.DataOra);
                            Testi.testo70 = "La richiesta è in errore, Data:  " + DataNew07 + ". Visualizzare il log per i dettagli.";
                            }

                            this.NewViewModel.setProperty('/History', Testi);

                            resolve();
                            
                        },
                        error: e => {
                            
                            this.showErrorMessage(this.parseError(e)); 
                            reject(e);
                            
                        }
                    })
                });



            },



            getStatoCombo:function(){
                this.ComboModel.read('/ZwfcogeStatoricSet', {
                    success: oData => {
                        this.NewViewModel.setProperty('/StatoRic', oData.results);
                    },
                    error: e => {
                        
                        this.showErrorMessage(this.parseError(e));  
                    }
                });
                this.ComboModel.read('/ZwfcogeTiporicSet', {
                    success: oData => {
                        this.NewViewModel.setProperty('/TipoRic', oData.results);
                    },
                    error: e => {
                        
                        this.showErrorMessage(this.parseError(e)); 
                    }
                });

            },


            getUserInfo:function(){
                this.ComboModel.read('/UserSet', {
                    success: oData => {
                        this.NewViewModel.setProperty('/UserInfo', oData.results[0]);
                    },
                    error: e => {
                        this.showErrorMessage(this.parseError(e)); 
                    }
                });
            },

            parseError: function (e) {
                let errorMessage;
                try {
                     errorMessage = JSON.parse(e.response.body).error.message.value;
                    } catch (error) {
                    errorMessage = e.responseText;
                }
                return errorMessage;
            },
            showMsgStrip: function (e) {
                var oMs = oCore.byId("msgStrip");
    
                if (oMs) {
                    oMs.destroy();
                }
                this._generateMsgStrip(e);
            },
    
            _generateMsgStrip: function (e) {
                var aTypes = ["Information", "Warning", "Error", "Success"],
                    sText = this.parseError(e),
                    sType = aTypes[Math.round(Math.random() * 3)],
                    oVC = this.byId("oVerticalContent"),
                    oMsgStrip = new MessageStrip("msgStrip", {
                        text: sText,
                        showCloseButton: !(Math.round(Math.random())),
                        showIcon: !(Math.round(Math.random())),
                        type: sType
                    });
                    this.oInvisibleMessage.announce("New Information Bar of type " + sType + " " + sText, InvisibleMessageMode.Assertive);
                    oVC.addContent(oMsgStrip);
            },
            showErrorMessage:function(e){
                if (!this.oWarningMessageDialog) {
					this.oWarningMessageDialog = new Dialog({
						type: DialogType.Message,
						title: "Errore",
						state: ValueState.Error,
						content: new Text({ text: e }),
						endButton: new Button({
							type: ButtonType.Emphasized,
							text: "Chiudi",
							press: function () {
								this.oWarningMessageDialog.close();
							}.bind(this)
						})
					});
				}

				this.oWarningMessageDialog.open();
            },
            FormatData:function(data){
                const anno = data.slice(0, 4);
                const mese = data.slice(4, 6) - 1;
                const giorno = data.slice(6, 8);
                const dataCompleta = new Date(anno, mese, giorno);

                const formatter = new Intl.DateTimeFormat('it-IT', { year: 'numeric', month: '2-digit', day: '2-digit' });
                return formatter.format(dataCompleta);
            }
        });
    });


