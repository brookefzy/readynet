class View {
  /**
   *
   * @param {Model} model
   */
  constructor(model) {
    this._model = model;

    this._map = new Mapp(this._model, $("#map"));
    this._netControl = new NetControl(this._model, $("#connections"));

    this._chart = new ExportedCasesChart($("#histo_container"), this._model);
    this._topTenChart = new TopTenChart($("#topten_container"), this._model);
    this._topTenChart.highlightTTEntity.add(
      this._onHighlightEntityRequest.bind(this)
    );
    this._topTenChart.playdownTTEntity.add(() =>
      this._map.showConnections({}, "connectionsSource")
    );

    this._initElements();
    this._initTabs();
  }

  get map() {
    return this._map;
  }

  showLoading() {
    this._setState(View.LOADING_STATE);
  }

  //   showResults() {
  //     $("#exportedCases").toggleClass(
  //       "enabled",
  //       this._model.query.hasCasesInformation() &&
  //         this._model.query.hasPeriodInformation()
  //     );
  //     this._setState(
  //       this._model.query.isEmpty() ? View.EMPTY_STATE : View.RESULTS_STATE
  //     );
  //     this._updateLink(this._$dowloadJSON, this._model.riskResults.asJSONDataURL);
  //     this._updateLink(this._$dowloadCSV, this._model.riskResults.asCSVDataURL);
  //   }

  _setState(state) {
    $("BODY").removeClass(View.STATES.join(" "));
    $("BODY").addClass(state);
    this._scroll.update();
  }

  //   initForm() {
  //     this._form = new Form(this._model, $("#form"));
  //     this._form.show();
  //   }

  _initElements() {
    this._$dowloadJSON = $("#downloadJSON");
    this._$dowloadCSV = $("#downloadCSV");
    this._$dowloadMap = $("#downloadMap");
    this._$fixedHeader = $(".top");
    this._$sidebar = $("#sidebar");
    this._$title = $("#title");

    this._$title.on("click", this._onTitleClick.bind(this));
    this._$dowloadMap.on("click", this._onDownloadMapCLick.bind(this));
    this._$sidebar[0].addEventListener(
      "ps-scroll-x",
      this._onScroll.bind(this)
    );

    this._scroll = new PerfectScrollbar("#sidebar");
  }

  _onHighlightEntityRequest(entityId) {
    this._map.showConnections(
      { [entityId]: this._model.riskResults.getIncomingConnections(entityId) },
      "connectionsSource"
    );
  }

  _onTitleClick() {
    this._model.reset();
    this._map.reset();
    this._map.resetPosition();
    this._setState(View.EMPTY_STATE);
  }

  _onScroll() {
    this._$fixedHeader.toggleClass("shadow", this._$sidebar.scrollTop() > 20);
  }

  _updateLink($link, dataUrl) {
    $link.attr("href", dataUrl);
  }

  _onDownloadMapCLick() {
    let mapData = this._map.getDataURL();
    mapData = mapData.replace(
      /^data:image\/png/,
      "data:application/octet-stream"
    );
    this._$dowloadMap.attr("href", mapData);
  }

  _initTabs() {
    $("#statisticRDOF").on("click", () =>
      this._showTab("#statisticRDOF", "#rdof")
    );
    $("#statisticACS").on("click", () => {
      this._showTab("#statisticACS", "#acs");
      this._topTenChart.setVisible(true);
    });

    $("#tabData").on("click", () => this._showTab("#tabData", "#data"));

    this._showTab("#statisticRDOF", "#rdof");
    this._chart.setVisible(true);
  }

  _showTab(tabId, contentId) {
    if (contentId) {
      $(".tabContent").removeClass("active");
      $(contentId).addClass("active");
    }

    if (tabId) {
      $("#tabs li").removeClass("active");
      $(tabId).addClass("active");
    }
    this._scroll.update();
  }
}

View.RESULTS_STATE = "results";
View.LOADING_STATE = "loading";
View.EMPTY_STATE = "empty";
View.STATES = [View.LOADING_STATE, View.RESULTS_STATE, View.EMPTY_STATE];
