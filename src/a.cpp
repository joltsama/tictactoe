#include <bits/stdc++.h>
using namespace std;

int main()
{
    //code
    int t;
    cin >> t;
    for (int m = 0; m < t; m++)
    {
        string s;
        cin >> s;
        int len = s.length();
        int maxLength = 1;
        int start = 0;
        int low, high;
        for (int i = 0; i < len; i++)
        {
            //for even palindrome
            low = i - 1;
            high = i;

            while (low >= 0 && high < len && s[low] == s[high])
            {
                if (high - low + 1 > maxLength)
                {
                    start = low;
                    maxLength = high - low + 1;
                }
                --low;
                ++high;
            }

            //for odd palindrome
            low = i - 1;
            high = i + 1;

            while (low >= 0 && high < len && s[low] == s[high])
            {
                if (high - low + 1 > maxLength)
                {
                    start = low;
                    maxLength = high - low + 1;
                }
                --low;
                ++high;
            }
        }
        for (int i = start; i < start + maxLength; i++)
        {
            cout << s[i];
        }
    }
    cout << endl;

    return 0;
}