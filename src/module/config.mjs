const UTS = {};

UTS.chess = {
  pieces: {
    pawn: {
      label: "UTS.Chess.Pieces.P",
      abbr: "P",
      value: 1
    },
    knight: {
      label: "UTS.Chess.Pieces.K",
      abbr: "N",
      value: 3
    },
    bishop: {
      label: "UTS.Chess.Pieces.B",
      abbr: "B",
      value: 3
    },
    rook: {
      label: "UTS.Chess.Pieces.R",
      abbr: "R",
      value: 5
    },
    queen: {
      label: "UTS.Chess.Pieces.Q",
      abbr: "Q",
      value: 9
    },
    king: {
      label: "UTS.Chess.Pieces.K",
      abbr: "K",
      value: Infinity
    }
  }
};

export default UTS;
