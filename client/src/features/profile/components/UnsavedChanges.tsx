interface UnsavedChangesProps {
  form: string;
  handleReset: () => void;
  flashWarning: boolean;
}

export default function UnsavedChanges({ form, handleReset, flashWarning }: UnsavedChangesProps) {
  return (
    <div
      className={`flex items-center gap-6 rounded-lg px-4 py-3 transition-colors duration-300 ${flashWarning ? 'bg-danger border-danger' : 'bg-dark-500 border-dark-400'}`}
    >
      <p className="mr-auto truncate font-semibold">Careful — you have unsaved changes!</p>
      <button
        className="text-info cursor-pointer rounded-lg font-semibold hover:underline"
        onClick={handleReset}
      >
        Reset
      </button>
      <button
        type="submit"
        form={form}
        className="bg-success hover:bg-success-hover cursor-pointer rounded-lg px-3 py-2 font-semibold text-nowrap"
      >
        Save Changes
      </button>
    </div>
  );
}
