import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState, MouseEvent, FC } from "react";
import { Menu, MenuItem, Button } from "@mui/material";
import Image from "next/image";
import { Locale } from "@/i18n/config";
import { setUserLocale } from "@/services/locale";
import { useTransition } from "react";
import { useLocale } from "next-intl";
import { Fragment } from "react";
interface LanguageProps {
  className?: string;
}
const languages = [
  { code: "en", label: "English" },
  { code: "pt", label: "Portuguese" },
];

const Language: FC<LanguageProps> = ({ className = "" }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const currentLocale = useLocale();
  const open = Boolean(anchorEl);
  const [isPending, startTransition] = useTransition();

  const locale = useLocale();
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickChangeLanguage = (lang: string) => {
    const locale = lang as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
    setAnchorEl(null);
  };
  return (
    <Fragment>
      <Button
        className={`language-switcher ${className}`}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        disabled={isPending}
      >
        <Image
          src={`/images/flags/${
            languages.find((item) => item.code == currentLocale)?.code
          }.svg`}
          width={25}
          height={15}
          alt={
            languages.find((item) => item.code == currentLocale)?.label ?? ""
          }
          style={{
            marginRight: "7px",
          }}
        />
        {languages.find((item) => item.code == currentLocale)?.label}
        <KeyboardArrowDownIcon />
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {languages.map((item) => (
          <MenuItem
            key={item.code}
            onClick={() => handleClickChangeLanguage(item.code)}
            selected={locale == item.code}
          >
            <Image
              src={`/images/flags/${item.code}.svg`}
              width={20}
              height={18}
              alt={item.label}
              style={{
                marginRight: "7px",
              }}
            />
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  );
};
export default Language;
