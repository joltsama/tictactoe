#include<bits/stdc++.h>
#include<string>
using namespace std;
int main () {
   int n;
   cin >> n;
   for (int i =0;i <n; i++){
	   string brac;
       cin >> brac;

       stack<char> s;
   char x;
   int y =0;

   for (int i = 0; i<brac.length();i++){
      if (brac[i]=='{' || brac[i]=='[' || brac[i]=='(')
      {
         s.push(brac[i]);
         continue;
      }

      if (s.empty()){
         cout << "NO" << endl;
      }

      switch(brac[i]){
         case ')':
         x=s.top();
         s.pop();
         if(x=='{'||x=='[')
         y= -1;
         break;

         case '}' :
         x=s.top();
         s.pop();
         if(x=='('||x=='[')
         y= -1;
         break;

         case ']' :
         x=s.top();
         s.pop();
         if(x=='('||x=='{')
         y= -1;
         break;


      }

   }
   if(s.empty()){
      cout << "YES" << endl;
   }
   else if(y==-1 || !s.empty()){
      cout << "NO" << endl;
   }
   
   
   }
   

}