import CartIcon from "./assets/icons/CartIcon";
import CoinIcon from "./assets/icons/CoinIcon";
import ComputerIcon from "./assets/icons/ComputerIcon";
import HouseIcon from "./assets/icons/HouseIcon";
import LaundryIcon from "./assets/icons/LaundryIcon";
import MoviesIcon from "./assets/icons/MoviesIcon";
import ProfileIcon from "./assets/icons/ProfileIcon";
import WifiIcon from "./assets/icons/WifiIcon";

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const CATEGORIES = [
  { label: "Electronics", value: "electronics" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Groceries", value: "groceries" },
  { label: "Home", value: "home" },
  { label: "Internet", value: "internet" },
  { label: "Miscellanious", value: "misc" },
  { label: "Personal", value: "personal" },
  { label: "Rent", value: "rent" },
];

export const ICON_CATEGORY_MAPPING: Record<
  string,
  React.FC<{ size?: number; style?: {} }>
> = {
  groceries: CartIcon,
  electronics: ComputerIcon,
  rent: HouseIcon,
  misc: CoinIcon,
  entertainment: MoviesIcon,
  internet: WifiIcon,
  home: LaundryIcon,
  personal: ProfileIcon,
};

export const CATEGORY_COLOURS: Record<string, string> = {
  groceries: "#FF928A",
  electronics: "#FFDA8A",
  rent: "#8A9FE3",
  entertainment: "#c497f7",
  miscellanious: "#adf55f",
  internet: "#f56788",
  home: "#716ded",
  personal: "#FF7F50",
};

export const TIME_RANGES = [
  { label: "Last week", value: "last_week" },
  { label: "Last month", value: "last_month" },
  { label: "Last 3 months", value: "last_3_months" },
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
