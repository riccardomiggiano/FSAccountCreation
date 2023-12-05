sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/core/library",
    "../model/servicemodel",
    "sap/m/Text",
    "sap/m/TextArea",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/Label",
    "sap/ui/core/Core",
  ],
  function (
    BaseController,
    JSONModel,
    Filter,
    FilterOperator,
    MessageToast,
    MessageBox,
    Fragment,
    CoreLibrary,
    Servicemodel,
    Text,
    TextArea,
    Dialog,
    Button,
    mobileLibrary,
    Label,
    Core
  ) {
    "use strict";

    return BaseController.extend("zfsaccountcreation.controller.MainWizard", {
      onInit: function () {
        this.StepModel = new JSONModel({
          Step2items: {},
          Step3items: {},
          Step4items: {},
          Step2Visibility: true,
          Step3Visibility: true,
          Step4Visibility: true,
          SelectedStep1: "",
          SelectedStep2: "",
          SelectedStep3: "",
          SelectedStep4: "",
          Level1items: {},
          Level2items: {},
          Level3items: {},
          Level4items: {},
          Level5items: {},
          Level6items: {},
          Level1Visibility: true,
          Level2Visibility: true,
          Level3Visibility: true,
          Level4Visibility: true,
          Level5Visibility: true,
          SubmitVisible: false,
          ApprovalVisible: false,
          SelectedLevel1: "",
          SelectedLevel1V: "",
          SelectedLevel2: "",
          SelectedLevel2V: "",
          SelectedLevel3: "",
          SelectedLevel3V: "",
          SelectedLevel4: "",
          SelectedLevel4V: "",
          SelectedLevel5: "",
          SelectedLevel5V: "",
          SelectedLevel6: "",
          Guid: "",
          Level1Note: "",
          Level2Note: "",
          Level3Note: "",
          Level4Note: "",
          Level5Note: "",
        });
        this.getView().setModel(this.StepModel, "StepModel");

        this.getRouter()
          .getRoute("object")
          .attachPatternMatched(this._onObjectMatched, this);
        this.getRouter()
          .getRoute("RouteMainWizard")
          .attachPatternMatched(this._onWRouteMatched, this);
      },
      onNavBack: function () {
        this.getRouter().navTo("RouteMainWorklist");
      },
      _clearAllValues: function () {
        this.StepModel.setData({
          Step2items: {},
          Step3items: {},
          Step4items: {},
          Step2Visibility: true,
          Step3Visibility: true,
          Step4Visibility: true,
          SelectedStep1: "",
          SelectedStep2: "",
          SelectedStep3: "",
          SelectedStep4: "",
          Level1items: {},
          Level2items: {},
          Level3items: {},
          Level4items: {},
          Level5items: {},
          Level6items: {},
          Level1Visibility: true,
          Level2Visibility: true,
          Level3Visibility: true,
          Level4Visibility: true,
          Level5Visibility: true,
          SubmitVisible: false,
          ApprovalVisible: false,
          SelectedLevel1: "",
          SelectedLevel1V: "",
          SelectedLevel2: "",
          SelectedLevel2V: "",
          SelectedLevel3: "",
          SelectedLevel3V: "",
          SelectedLevel4: "",
          SelectedLevel4V: "",
          SelectedLevel5: "",
          SelectedLevel5V: "",
          SelectedLevel6: "",
          Guid: "",
          Level1Note: "",
          Level2Note: "",
          Level3Note: "",
          Level4Note: "",
          Level5Note: "",
        });
      },
      _onWRouteMatched: function (oEvent) {
        this._clearAllValues();
        this._wizard = this.byId("ApprovalWizard");
        var oFirstStep = this._wizard.getSteps();
        this._wizard.discardProgress(oFirstStep[0]);
        oFirstStep[0].setVisible(true);
        oFirstStep[1].setVisible(true);
        oFirstStep[2].setVisible(true);
        oFirstStep[3].setVisible(true);
        oFirstStep[4].setVisible(true);
        oFirstStep[5].setVisible(true);
        this.StepModel.setProperty("/SubmitVisible", true);
        this.StepModel.setProperty("/ApprovalVisible", false);
      },
      _onObjectMatched: function (oEvent) {
        var sObjectId = oEvent.getParameter("arguments").objectId;

        var sfilter1 = new Filter({
          path: "Level06",
          operator: "EQ",
          value1: sObjectId,
        });
        var sPath = "/Level6Set";
        this.getView()
          .getModel()
          .read(sPath, {
            filters: [sfilter1],
            success: (oData) => {
              this.StepModel.setProperty("/Level6items", oData.results);
              if (oData.results.length === 0) {
                this.StepModel.setProperty("/Level6Visibility", false);
              } else {
                this.StepModel.setProperty("/Level6Visibility", true);
              }
            },
            error: (e) => {
              this.showErrorMessage(this.parseError(e));
            },
          });

        sPath = "/ApprovalListSet";
        this.getView()
          .getModel()
          .read(sPath, {
            filters: [sfilter1],
            success: (oData) => {
              this.StepModel.setProperty("/Guid", oData.results[0].Guid);
              this.StepModel.setProperty(
                "/SelectedLevel6",
                oData.results[0].Level06
              );
              this.StepModel.setProperty(
                "/SelectedLevel5V",
                oData.results[0].Level05
              );
              this.StepModel.setProperty(
                "/SelectedLevel4V",
                oData.results[0].Level04
              );
              this.StepModel.setProperty(
                "/SelectedLevel3V",
                oData.results[0].Level03
              );
              this.StepModel.setProperty(
                "/SelectedLevel2V",
                oData.results[0].Level02
              );
              this.StepModel.setProperty(
                "/SelectedLevel1V",
                oData.results[0].Level01
              );
              this.StepModel.setProperty(
                "/SelectedStep1",
                oData.results[0].Step1
              );
              this.StepModel.setProperty(
                "/SelectedStep2",
                oData.results[0].Step2
              );
              this.StepModel.setProperty(
                "/SelectedStep3",
                oData.results[0].Step3
              );
              this.StepModel.setProperty(
                "/SelectedStep4",
                oData.results[0].Step4
              );

              this.StepModel.setProperty("/SubmitVisible", false);
              this.StepModel.setProperty("/ApprovalVisible", true);
            },
            error: (e) => {
              this.showErrorMessage(this.parseError(e));
            },
          });

        this._wizard = this.byId("ApprovalWizard");

        var oFirstStep = this._wizard.getSteps();
        this._wizard.discardProgress(oFirstStep[0]);
        oFirstStep[0].setVisible(false);
        oFirstStep[1].setVisible(false);
        oFirstStep[2].setVisible(false);
        oFirstStep[3].setVisible(false);
        oFirstStep[4].setVisible(false);
        oFirstStep[5].setVisible(false);

        var oCurrStep = this.getView().byId("Level6WStep");
        this._wizard.setCurrentStep(oCurrStep);
      },
      onChangeStep1: function (oEvent) {
        this.StepModel.setProperty("/Step2items", {});
        this.StepModel.setProperty("/Step3items", {});
        this.StepModel.setProperty("/Step4items", {});
        this.StepModel.setProperty("/Step2Visibility", true);
        this.StepModel.setProperty("/Step3Visibility", true);
        this.StepModel.setProperty("/Step4Visibility", true);

        this.StepModel.setProperty("/SelectedStep2", "");
        this.StepModel.setProperty("/SelectedStep3", "");
        this.StepModel.setProperty("/SelectedStep4", "");
        var selectedKey = this.StepModel.getProperty("/SelectedStep1");
        var sfilter1 = new Filter({
          path: "Step1",
          operator: "EQ",
          value1: selectedKey,
        });
        var sfilter2 = new Filter({
          path: "Step2",
          operator: "NE",
          value1: "",
        });
        var sPath = "/Step2Set";
        this.getView()
          .getModel()
          .read(sPath, {
            filters: [sfilter1, sfilter2],
            success: (oData) => {
              this.StepModel.setProperty("/Step2items", oData.results);
              if (oData.results.length === 0) {
                this.StepModel.setProperty("/Step2Visibility", false);
                this.onChangeStep2();
              } else {
                this.StepModel.setProperty("/Step2Visibility", true);
              }
            },
            error: (e) => {
              this.showErrorMessage(this.parseError(e));
            },
          });
      },

      onChangeStep2: function (oEvent) {
        this.StepModel.setProperty("/Step3items", {});
        this.StepModel.setProperty("/Step4items", {});

        this.StepModel.setProperty("/Step3Visibility", true);
        this.StepModel.setProperty("/Step4Visibility", true);

        this.StepModel.setProperty("/SelectedStep3", "");
        this.StepModel.setProperty("/SelectedStep4", "");
        var selectedKey = this.StepModel.getProperty("/SelectedStep2");
        //var selectedKey = oEvent.getSource().getSelectedKey();
        var sfilter1 = new Filter({
          path: "Step2",
          operator: "EQ",
          value1: selectedKey,
        });
        var sfilter2 = new Filter({
          path: "Step3",
          operator: "NE",
          value1: "",
        });
        var selectedStep1 = this.StepModel.getProperty("/SelectedStep1");
        var sfilter3 = new Filter({
          path: "Step1",
          operator: "EQ",
          value1: selectedStep1,
        });
        var sPath = "/Step3Set";
        this.getView()
          .getModel()
          .read(sPath, {
            filters: [sfilter1, sfilter2, sfilter3],
            success: (oData) => {
              this.StepModel.setProperty("/Step3items", oData.results);
              if (oData.results.length === 0) {
                this.StepModel.setProperty("/Step3Visibility", false);
                this.onChangeStep3();
              } else {
                this.StepModel.setProperty("/Step3Visibility", true);
              }
            },
            error: (e) => {
              this.showErrorMessage(this.parseError(e));
            },
          });
      },

      onChangeStep3: function (oEvent) {
        this.StepModel.setProperty("/Step4items", {});
        this.StepModel.setProperty("/Step4Visibility", true);
        this.StepModel.setProperty("/SelectedStep4", "");
        var selectedKey = this.StepModel.getProperty("/SelectedStep3");
        var sfilter1 = new Filter({
          path: "Step3",
          operator: "EQ",
          value1: selectedKey,
        });
        var sfilter2 = new Filter({
          path: "Step4",
          operator: "NE",
          value1: "",
        });
        var selectedStep2 = this.StepModel.getProperty("/SelectedStep2");
        var sfilter3 = new Filter({
          path: "Step2",
          operator: "EQ",
          value1: selectedStep2,
        });
        var selectedStep1 = this.StepModel.getProperty("/SelectedStep1");
        var sfilter4 = new Filter({
          path: "Step1",
          operator: "EQ",
          value1: selectedStep1,
        });
        var sPath = "/Step4Set";
        this.getView()
          .getModel()
          .read(sPath, {
            filters: [sfilter1, sfilter2, sfilter3, sfilter4],
            success: (oData) => {
              this.StepModel.setProperty("/Step4items", oData.results);
              if (oData.results.length === 0) {
                this.StepModel.setProperty("/Step4Visibility", false);
                this.onChangeStep4();
              } else {
                this.StepModel.setProperty("/Step4Visibility", true);
              }
            },
            error: (e) => {
              this.showErrorMessage(this.parseError(e));
            },
          });
      },

      onChangeStep4: function (oEvent) {
        this.StepModel.setProperty("/Level1items", {});
        this.StepModel.setProperty("/Level2items", {});
        this.StepModel.setProperty("/Level3items", {});
        this.StepModel.setProperty("/Level4items", {});
        this.StepModel.setProperty("/Level5items", {});
        this.StepModel.setProperty("/Level1Visibility", true);
        this.StepModel.setProperty("/Level2Visibility", true);
        this.StepModel.setProperty("/Level3Visibility", true);
        this.StepModel.setProperty("/Level4Visibility", true);
        this.StepModel.setProperty("/Level5Visibility", true);
        this.StepModel.setProperty("/SelectedLevel1", "");
        this.StepModel.setProperty("/SelectedLevel2", "");
        this.StepModel.setProperty("/SelectedLevel3", "");
        this.StepModel.setProperty("/SelectedLevel4", "");
        this.StepModel.setProperty("/SelectedLevel5", "");
        var sfilter1 = new Filter({
          path: "Step1",
          operator: "EQ",
          value1: this.StepModel.getProperty("/SelectedStep1"),
        });
        var sfilter2 = new Filter({
          path: "Step2",
          operator: "EQ",
          value1: this.StepModel.getProperty("/SelectedStep2"),
        });
        var sfilter3 = new Filter({
          path: "Step3",
          operator: "EQ",
          value1: this.StepModel.getProperty("/SelectedStep3"),
        });
        var sfilter4 = new Filter({
          path: "Step4",
          operator: "EQ",
          value1: this.StepModel.getProperty("/SelectedStep4"),
        });
        var sfilter5 = new Filter({
          path: "Level01",
          operator: "NE",
          value1: "",
        });
        var sPath = "/Level1Set";
        this.getView()
          .getModel()
          .read(sPath, {
            filters: [sfilter1, sfilter2, sfilter3, sfilter4],
            success: (oData) => {
              this.StepModel.setProperty("/Level1items", oData.results);
              if (oData.results.length === 0) {
                this.StepModel.setProperty("/Level1Visibility", false);
              } else {
                this.StepModel.setProperty("/Level1Visibility", true);
              }
            },
            error: (e) => {
              this.showErrorMessage(this.parseError(e));
            },
          });
      },

      onChangeLevel1: function (oEvent) {
        this.StepModel.setProperty("/Level2items", {});
        this.StepModel.setProperty("/Level3items", {});
        this.StepModel.setProperty("/Level4items", {});
        this.StepModel.setProperty("/Level5items", {});
        this.StepModel.setProperty("/Level2Visibility", true);
        this.StepModel.setProperty("/Level3Visibility", true);
        this.StepModel.setProperty("/Level4Visibility", true);
        this.StepModel.setProperty("/Level5Visibility", true);
        this.StepModel.setProperty("/SelectedLevel2", "");
        this.StepModel.setProperty("/SelectedLevel3", "");
        this.StepModel.setProperty("/SelectedLevel4", "");
        this.StepModel.setProperty("/SelectedLevel5", "");

        var sfilter1 = new Filter({
          path: "Level01",
          operator: "EQ",
          value1: this.StepModel.getProperty("/SelectedLevel1"),
        });
        var sfilter2 = new Filter({
          path: "Level02",
          operator: "NE",
          value1: "",
        });
        var sPath = "/Level2Set";
        this.getView()
          .getModel()
          .read(sPath, {
            filters: [sfilter1, sfilter2],
            success: (oData) => {
              this.StepModel.setProperty("/Level2items", oData.results);
              if (oData.results.length === 0) {
                this.StepModel.setProperty("/Level2Visibility", false);
              } else {
                this.StepModel.setProperty("/Level2Visibility", true);
              }
            },
            error: (e) => {
              this.showErrorMessage(this.parseError(e));
            },
          });

        var result = this.StepModel.getProperty("/Level1items").find(
          (item) =>
            item.Level01 === this.StepModel.getProperty("/SelectedLevel1")
        );
        this.StepModel.setProperty("/Level1Note", result.Note);
        this.StepModel.setProperty("/SelectedLevel1V", result.Descrption);
      },

      onChangeLevel2: function (oEvent) {
        this.StepModel.setProperty("/Level3items", {});
        this.StepModel.setProperty("/Level4items", {});
        this.StepModel.setProperty("/Level5items", {});
        this.StepModel.setProperty("/Level3Visibility", true);
        this.StepModel.setProperty("/Level4Visibility", true);
        this.StepModel.setProperty("/Level5Visibility", true);
        this.StepModel.setProperty("/SelectedLevel3", "");
        this.StepModel.setProperty("/SelectedLevel4", "");
        this.StepModel.setProperty("/SelectedLevel5", "");

        var sfilter1 = new Filter({
          path: "Level02",
          operator: "EQ",
          value1: this.StepModel.getProperty("/SelectedLevel2"),
        });
        var sfilter2 = new Filter({
          path: "Level03",
          operator: "NE",
          value1: "",
        });
        var sPath = "/Level3Set";
        this.getView()
          .getModel()
          .read(sPath, {
            filters: [sfilter1, sfilter2],
            success: (oData) => {
              this.StepModel.setProperty("/Level3items", oData.results);
              if (oData.results.length === 0) {
                this.StepModel.setProperty("/Level3Visibility", false);
              } else {
                this.StepModel.setProperty("/Level3Visibility", true);
              }
            },
            error: (e) => {
              this.showErrorMessage(this.parseError(e));
            },
          });
        var result = this.StepModel.getProperty("/Level2items").find(
          (item) =>
            item.Level02 === this.StepModel.getProperty("/SelectedLevel2")
        );

        this.StepModel.setProperty("/Level2Note", result.Note);
        this.StepModel.setProperty("/SelectedLevel2V", result.Descrption);
      },

      onChangeLevel3: function (oEvent) {
        this.StepModel.setProperty("/Level4items", {});
        this.StepModel.setProperty("/Level5items", {});
        this.StepModel.setProperty("/Level4Visibility", true);
        this.StepModel.setProperty("/Level5Visibility", true);
        this.StepModel.setProperty("/SelectedLevel4", "");
        this.StepModel.setProperty("/SelectedLevel5", "");

        var sfilter1 = new Filter({
          path: "Level03",
          operator: "EQ",
          value1: this.StepModel.getProperty("/SelectedLevel3"),
        });
        var sfilter2 = new Filter({
          path: "Level04",
          operator: "NE",
          value1: "",
        });
        var sPath = "/Level4Set";
        this.getView()
          .getModel()
          .read(sPath, {
            filters: [sfilter1, sfilter2],
            success: (oData) => {
              this.StepModel.setProperty("/Level4items", oData.results);
              if (oData.results.length === 0) {
                this.StepModel.setProperty("/Level4Visibility", false);
              } else {
                this.StepModel.setProperty("/Level4Visibility", true);
              }
            },
            error: (e) => {
              this.showErrorMessage(this.parseError(e));
            },
          });
        var result = this.StepModel.getProperty("/Level3items").find(
          (item) =>
            item.Level03 === this.StepModel.getProperty("/SelectedLevel3")
        );
        this.StepModel.setProperty("/Level3Note", result.Note);
        this.StepModel.setProperty("/SelectedLevel3V", result.Descrption);
      },

      onChangeLevel4: function (oEvent) {
        this.StepModel.setProperty("/Level5items", {});
        this.StepModel.setProperty("/Level5Visibility", true);
        this.StepModel.setProperty("/SelectedLevel5", "");

        var sfilter1 = new Filter({
          path: "Level04",
          operator: "EQ",
          value1: this.StepModel.getProperty("/SelectedLevel4"),
        });
        var sfilter2 = new Filter({
          path: "Level05",
          operator: "NE",
          value1: "",
        });
        var sPath = "/Level5Set";
        this.getView()
          .getModel()
          .read(sPath, {
            filters: [sfilter1, sfilter2],
            success: (oData) => {
              this.StepModel.setProperty("/Level5items", oData.results);
              if (oData.results.length === 0) {
                this.StepModel.setProperty("/Level5Visibility", false);
              } else {
                this.StepModel.setProperty("/Level5Visibility", true);
              }
            },
            error: (e) => {
              this.showErrorMessage(this.parseError(e));
            },
          });
        var result = this.StepModel.getProperty("/Level4items").find(
          (item) =>
            item.Level04 === this.StepModel.getProperty("/SelectedLevel4")
        );
        this.StepModel.setProperty("/Level4Note", result.Note);
        this.StepModel.setProperty("/SelectedLevel4V", result.Descrption);
      },

      onChangeLevel5: function (oEvent) {
        var result = this.StepModel.getProperty("/Level5items").find(
          (item) =>
            item.Level05 === this.StepModel.getProperty("/SelectedLevel5")
        );
        this.StepModel.setProperty("/SelectedLev5l1V", result.Descrption);
        var sfilter1 = new Filter({
          path: "Level06",
          operator: "EQ",
          value1: this.StepModel.getProperty("/SelectedLevel5"),
        });

        var sPath = "/Level6Set";
        this.getView()
          .getModel()
          .read(sPath, {
            filters: [sfilter1],
            success: (oData) => {
              this.StepModel.setProperty(
                "/SelectedLevel6",
                oData.results[0].Level06
              );
              this.StepModel.setProperty("/Guid", oData.results[0].Guid);
              this.StepModel.setProperty("/Level6items", oData.results);
              if (oData.results.length === 0) {
                this.StepModel.setProperty("/Level6Visibility", false);
              } else {
                this.StepModel.setProperty("/Level6Visibility", true);
              }
            },
            error: (e) => {
              this.showErrorMessage(this.parseError(e));
            },
          });

        var result = this.StepModel.getProperty("/Level5items").find(
          (item) =>
            item.Level05 === this.StepModel.getProperty("/SelectedLevel5")
        );
        this.StepModel.setProperty("/Level5Note", result.Note);
        this.StepModel.setProperty("/SelectedLevel5V", result.DESCRPTION);
      },

      setDiscardableProperty: function (params) {
        if (this._wizard.getProgressStep() !== params.discardStep) {
          MessageBox.warning(params.message, {
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            onClose: function (oAction) {
              if (oAction === MessageBox.Action.YES) {
                this._wizard.discardProgress(params.discardStep);
                history[params.historyPath] = this.model.getProperty(
                  params.modelPath
                );
              } else {
                this.model.setProperty(
                  params.modelPath,
                  history[params.historyPath]
                );
              }
            }.bind(this),
          });
        } else {
          history[params.historyPath] = this.model.getProperty(
            params.modelPath
          );
        }
      },

      handleWizardCancel: function () {
        this._clearAllValues();
        this.onNavBack();
      },

      handleWizardSubmit: function () {
        this._handleMessageBoxOpen(
          "Are you sure you want to submit ?",
          "confirm"
        );
      },

      backToWizardContent: function () {
        this._oNavContainer.backToPage(this._oWizardContentPage.getId());
      },

      completedHandler: function () {
        this._handleMessageBoxOpen(
          "Are you sure you want to submit?",
          "confirm"
        );
      },

      _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
        var that = this;
        MessageBox[sMessageBoxType](sMessage, {
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          onClose: function (oAction) {
            if (oAction === MessageBox.Action.YES) {
              var oNewEntry = {
                Step1: this.StepModel.getProperty("/SelectedStep1"),
                Step2: this.StepModel.getProperty("/SelectedStep2"),
                Step3: this.StepModel.getProperty("/SelectedStep3"),
                Step4: this.StepModel.getProperty("/SelectedStep4"),
                Level01: this.StepModel.getProperty("/SelectedLevel1"),
                Level02: this.StepModel.getProperty("/SelectedLevel2"),
                Level03: this.StepModel.getProperty("/SelectedLevel3"),
                Level04: this.StepModel.getProperty("/SelectedLevel4"),
                Level05: this.StepModel.getProperty("/SelectedLevel5"),
                Level06: this.StepModel.getProperty("/SelectedLevel6"),
                Status: "Requested",
                Approver: "",
                Time: "",
                Comments: "",
                Txt20: "",
                Type: this.StepModel.getProperty("/SelectedStep4"),
                Requester: "",
              };

              this.getView()
                .getModel()
                .create("/ApprovalListSet", oNewEntry, {
                  success: function (data) {
                    that.getRouter().navTo("RouteMainWorklist");
                  },
                  error: function (error) {
                    // Handle error during creation here

                    var aErrorMessages = that
                      .getView()
                      .getModel()
                      .getMessagesByPath("/ApprovalListSet");
                    MessageBox.error(
                      "Custom error from backend: " + aErrorMessages[0].message
                    );
                  },
                });
            }
          }.bind(this),
        });
      },

      ApproveHandler: function (oEvent) {
        this._handleMessageBoxOpenA(
          "Are you sure you want to Approve?",
          "confirm",
          "Approved",
          this.StepModel.getProperty("/SelectedStep4")
        );
      },
      RejectHandler: function (oEvent) {
        this._handleMessageBoxOpenA(
          "Are you sure you want to Reject?",
          "confirm",
          "Rejected",
          this.StepModel.getProperty("/SelectedStep4")
        );
      },
      ForwardHandler: function (oEvent) {
        this._handleMessageBoxOpenA(
          "Are you sure you want to Forward?",
          "confirm",
          "Forwarded",
          "Non Finanza"
        );
      },
      _handleMessageBoxOpenA: function (
        sMessage,
        sMessageBoxType,
        sStatus,
        sType
      ) {
        var that = this;
        MessageBox[sMessageBoxType](sMessage, {
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          onClose: function (oAction) {
            if (oAction === MessageBox.Action.YES) {
              var oModel = that.getView().getModel();
              var sEntityId = this.StepModel.getProperty("/Guid").trim();
              var oEntity = {
                Guid: this.StepModel.getProperty("/Guid"),
                Step4: sType,
                Level06: this.StepModel.getProperty("/SelectedLevel6"),
                Status: sStatus,
                Comments: "",
              };
              // Submit the changes
              oModel.update("/ApprovalListSet('" + sEntityId + "')", oEntity, {
                merge: false,
                success: function () {
                  // Entry updated successfully
                  console.log("Entry updated successfully");
                  that.getRouter().navTo("RouteMainWorklist");
                },
                error: function (oError) {
                  // Error handling
                  console.error("Error updating entry: ", oError);
                },
              });
            }
          }.bind(this),
        });
      },
    });
  }
);
