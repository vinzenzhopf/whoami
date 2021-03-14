namespace WhoAmI.App.Model.Data
{
    public class LobbySetting
    {
        public int MaxUserCount { get; set; } = 16;
        public bool OpenForPublic { get; set; } = false;
        public NameAssignmentMode NameAssignmentMode { get; set; } = NameAssignmentMode.Everybody;
    }
}
