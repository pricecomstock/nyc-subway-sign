export function getTrainColorGroup(train: string): string {
  const normalizedTrain = train.toUpperCase();
  switch (normalizedTrain) {
    case "A":
    case "C":
    case "E":
      return "ace";

    case "B":
    case "D":
    case "F":
    case "M":
      return "bdfm";

    case "G":
      return "g";

    case "J":
    case "Z":
      return "jz";

    case "L":
      return "l";

    case "N":
    case "Q":
    case "R":
      return "nqr";

    case "S":
      return "s";

    case "1":
    case "2":
    case "3":
      return "123";

    case "4":
    case "5":
    case "6":
      return "456";

    case "7":
      return "7";

    default:
      break;
  }
  return "";
}

export function getTrainColor(train: string): string {
  return `--mta-${getTrainColorGroup(train)}`;
}

export function getTrainColorFGClass(train: string): string {
  return `fg-mta-${getTrainColorGroup(train)}`;
}

export function getTrainColorBGClass(train: string): string {
  return `bg-mta-${getTrainColorGroup(train)}`;
}
