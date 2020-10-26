namespace TwoWeeksReady
{
    public interface IMyService
    {
        void DoNothing();
    }

    public class MyService : IMyService {
        public void DoNothing() { }
    }
}