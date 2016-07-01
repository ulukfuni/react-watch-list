var WatchList = React.createClass({
  render: function() {
    return (
      <div className='watch-list'>
        <h1>NBA Watch List</h1>
        I am the watch list!
        <WatchListForm/>
      </div>
    );
  }
});

var WatchListForm = React.createClass({
  render: function() {
    return (
      <form className='watchlist-form'>
        <AutoCompleteInput />
      </form>
    );
  }
});

var AutoCompleteInput = React.createClass({
  getInitialState: function(){
    return {player: ''};
  },
  componentDidMount: function(){
    var url = 'http://stats.nba.com/stats/commonallplayers?IsOnlyCurrentSeason=1&LeagueID=00&Season=2015-16',
    player; //TODO: make date proof
    this.serverRequest = $.get(url, function(data){
      var list = data.resultSets['0'].rowSet,
      playerList = [];
      for (var i in list) {
        playerList.push(list[i][2]);
      }
      $(ReactDOM.findDOMNode(this)).autocomplete({
        source: playerList,
        select: function(event, ui){
          player = ui.item.value;
      }
    });
    }.bind(this));
    this.setState({player: player});
  },
  componentWillUnmount: function() {
    $(ReactDOM.findDOMNode(this)).autocomplete('destroy');
    this.serverRequest.abort();
  },
  render: function(){
    return(
      <input type='text' placeholder='Enter Player Name...' player={this.state.player} />
    );
  }
});

// var Player = React.createClass({});
// var PlayerStats = React.createClass({});

ReactDOM.render(<WatchList />, document.getElementById('watch-list'))