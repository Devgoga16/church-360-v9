import {
  Shield,
  Cross,
  LayoutDashboard,
  Users,
  Users2,
  FileText,
  Settings,
  BarChart3,
  Heart,
  BookOpen,
  DollarSign,
  PieChart,
  CheckSquare,
  Church,
  HelpCircle,
  PlusCircle,
  Edit3,
  Trash2,
  Eye,
  Download,
  Upload,
  Lock,
  LogOut,
  Home,
  Search,
  Bell,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  GitBranch,
  Package,
  Code,
  Database,
  Zap,
  Filter,
  Save,
  X,
  Menu,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
} from "lucide-react";

type IconComponent = React.ComponentType<any>;

const faToLucideMap: Record<string, IconComponent> = {
  // Common fa icons mapping to Lucide
  "fas fa-user-shield": Shield,
  "fas fa-shield": Shield,
  "fas fa-cross": Cross,
  "fas fa-dashboard": LayoutDashboard,
  "fas fa-tachometer-alt": LayoutDashboard,
  "fas fa-users": Users,
  "fas fa-user-friends": Users2,
  "fas fa-file": FileText,
  "fas fa-file-alt": FileText,
  "fas fa-cog": Settings,
  "fas fa-cogs": Settings,
  "fas fa-chart-bar": BarChart3,
  "fas fa-heart": Heart,
  "fas fa-book": BookOpen,
  "fas fa-book-open": BookOpen,
  "fas fa-dollar-sign": DollarSign,
  "fas fa-chart-pie": PieChart,
  "fas fa-check-square": CheckSquare,
  "fas fa-church": Church,
  "fas fa-question-circle": HelpCircle,
  "fas fa-plus-circle": PlusCircle,
  "fas fa-edit": Edit3,
  "fas fa-pencil": Edit3,
  "fas fa-trash": Trash2,
  "fas fa-trash-2": Trash2,
  "fas fa-eye": Eye,
  "fas fa-download": Download,
  "fas fa-upload": Upload,
  "fas fa-lock": Lock,
  "fas fa-sign-out-alt": LogOut,
  "fas fa-home": Home,
  "fas fa-search": Search,
  "fas fa-bell": Bell,
  "fas fa-envelope": Mail,
  "fas fa-phone": Phone,
  "fas fa-map-marker-alt": MapPin,
  "fas fa-calendar": Calendar,
  "fas fa-clock": Clock,
  "fas fa-exclamation-circle": AlertCircle,
  "fas fa-check-circle": CheckCircle,
  "fas fa-times-circle": XCircle,
  "fas fa-arrow-up": TrendingUp,
  "fas fa-arrow-down": TrendingDown,
  "fas fa-activity": Activity,
  "fas fa-code-branch": GitBranch,
  "fas fa-box": Package,
  "fas fa-code": Code,
  "fas fa-database": Database,
  "fas fa-zap": Zap,
  "fas fa-filter": Filter,
  "fas fa-save": Save,
  "fas fa-times": X,
  "fas fa-bars": Menu,
  "fas fa-chevron-down": ChevronDown,
  "fas fa-chevron-right": ChevronRight,
  "fas fa-chevron-left": ChevronLeft,
  "fas fa-chevron-up": ChevronUp,
};

/**
 * Converts a Font Awesome icon class to a Lucide React icon component.
 * @param faClass Font Awesome class string (e.g., "fas fa-user-shield")
 * @param defaultIcon Fallback icon component if not found
 * @returns Lucide icon component
 */
export function getIconFromFontAwesome(
  faClass: string,
  defaultIcon: IconComponent = Settings
): IconComponent {
  if (!faClass) {
    return defaultIcon;
  }

  const icon = faToLucideMap[faClass.toLowerCase().trim()];
  return icon || defaultIcon;
}

export default faToLucideMap;
