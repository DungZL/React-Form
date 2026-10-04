import {
  THEM_SINH_VIEN,
  XOA_SINH_VIEN,
  CHINH_SUA_SINH_VIEN,
  CAP_NHAT_SINH_VIEN,
  HUY_CHINH_SUA
} from '../types/sinhVienTypes';

// Khởi tạo state ban đầu theo dữ liệu mẫu CyberSoft
const initialState = {
  danhSachSinhVien: [
    {
      maSV: '1',
      hoTen: 'Nguyễn Văn A',
      soDienThoai: '0938111111',
      email: 'nguyenvana@gmail.com'
    },
    {
      maSV: '2',
      hoTen: 'Nguyễn Văn B',
      soDienThoai: '0938222322',
      email: 'nguyenvanb@gmail.com'
    }
  ],
  selectedStudent: null // null: chế độ Thêm mới; có object: chế độ Cập nhật
};

export const sinhVienReducer = (state = initialState, action) => {
  switch (action.type) {
    case THEM_SINH_VIEN: {
      return {
        ...state,
        danhSachSinhVien: [...state.danhSachSinhVien, action.payload]
      };
    }

    case XOA_SINH_VIEN: {
      const updatedList = state.danhSachSinhVien.filter(
        (sv) => sv.maSV !== action.payload
      );
      // Nếu sinh viên đang được chọn chỉnh sửa bị xoá thì reset selectedStudent về null
      const isEditingDeleted = state.selectedStudent?.maSV === action.payload;
      return {
        ...state,
        danhSachSinhVien: updatedList,
        selectedStudent: isEditingDeleted ? null : state.selectedStudent
      };
    }

    case CHINH_SUA_SINH_VIEN: {
      return {
        ...state,
        selectedStudent: action.payload
      };
    }

    case CAP_NHAT_SINH_VIEN: {
      const updatedList = state.danhSachSinhVien.map((sv) =>
        sv.maSV === action.payload.maSV ? action.payload : sv
      );
      return {
        ...state,
        danhSachSinhVien: updatedList,
        selectedStudent: null // Cập nhật xong thì trả về trạng thái thêm mới
      };
    }

    case HUY_CHINH_SUA: {
      return {
        ...state,
        selectedStudent: null
      };
    }

    default:
      return state;
  }
};
