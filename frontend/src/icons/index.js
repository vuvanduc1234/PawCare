// Icon Components - Tất cả icon sử dụng Flaticon
// Sử dụng: import { HomeIcon, CalendarIcon, ... } from '../icons'

export const HomeIcon = () => <i className="fi fi-rr-home" />;
export const ServicesIcon = () => <i className="fi fi-rr-stethoscope" />;
export const CalendarIcon = () => <i className="fi fi-rr-calendar" />;
export const UserIcon = () => <i className="fi fi-rr-user" />;
export const DashboardIcon = () => <i className="fi fi-rr-chart-histogram" />;
export const UsersIcon = () => <i className="fi fi-rr-users" />;
export const HospitalIcon = () => <i className="fi fi-rr-hospital" />;
export const DocumentIcon = () => <i className="fi fi-rr-document" />;
export const ChartLineIcon = () => <i className="fi fi-rr-chart-line" />;
export const PlusIcon = () => <i className="fi fi-rr-plus" />;
export const PawIcon = () => <i className="fi fi-rr-paw" />;
export const BookOpenIcon = () => <i className="fi fi-rr-book-open" />;
export const InboxIcon = () => <i className="fi fi-rr-inbox" />;
export const SearchIcon = () => <i className="fi fi-rr-search" />;
export const CommentsIcon = () => <i className="fi fi-rr-comments" />;
export const PhoneIcon = () => <i className="fi fi-rr-phone-call" />;
export const ShoppingBagIcon = () => <i className="fi fi-rr-shopping-bag" />;
export const ExitIcon = () => <i className="fi fi-rr-exit" />;
export const TrashIcon = () => <i className="fi fi-rr-trash" />;
export const EyeIcon = () => <i className="fi fi-rr-eye" />;
export const HeartIcon = () => <i className="fi fi-rr-heart" />;
export const ShareIcon = () => <i className="fi fi-rr-share" />;
export const CheckIcon = () => <i className="fi fi-rr-check" />;
export const ClockIcon = () => <i className="fi fi-rr-clock" />;
export const StarIcon = () => <i className="fi fi-rr-star" />;
export const LocationIcon = () => <i className="fi fi-rr-marker" />;
export const EditIcon = () => <i className="fi fi-rr-pencil" />;
export const ImageIcon = () => <i className="fi fi-rr-image" />;
export const SaveIcon = () => <i className="fi fi-rr-floppy-disk" />;
export const HamburgerIcon = () => <i className="fi fi-rr-menu-burger" />;
export const CloseIcon = () => <i className="fi fi-rr-cross" />;
export const LoadingIcon = () => <i className="fi fi-rr-spinner" />;
export const AlertIcon = () => <i className="fi fi-rr-exclamation" />;
export const DogIcon = () => <i className="fi fi-rr-dog" />;
export const CatIcon = () => <i className="fi fi-rr-cat" />;
export const BirdIcon = () => <i className="fi fi-rr-bird" />;
export const RabbitIcon = () => <i className="fi fi-rr-rabbit" />;
export const ShowerIcon = () => <i className="fi fi-rr-shower" />;
export const HotelIcon = () => <i className="fi fi-rr-bed" />;
export const MoneyIcon = () => <i className="fi fi-rr-money" />;
export const PhoneCallIcon = () => <i className="fi fi-rr-phone" />;
export const CheckCircleIcon = () => <i className="fi fi-rr-check-circle" />;
export const AlertCircleIcon = () => <i className="fi fi-rr-circle-exclamation" />;

// Wrapper component để sử dụng với filter
export const IconWrapper = ({ children, className = '', style = {} }) => (
  <span
    className={className}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}
  >
    {children}
  </span>
);

// Preset filters
export const iconFilters = {
  white: { filter: 'brightness(0) invert(1)' },
  teal: { filter: 'invert(35%) sepia(25%) saturate(850%) hue-rotate(160deg) brightness(100%)' },
  coral: { filter: 'invert(45%) sepia(55%) saturate(1000%) hue-rotate(350deg) brightness(105%)' },
};
