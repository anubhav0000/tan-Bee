#include <stdio.h>

int countDigits(int n)
{
    if (n == 0)
        return 0;

    return 1 + countDigits(n / 10);
}

int main()
{
    int n, digits;

    printf("Enter a number: ");
    scanf("%d", &n);

    if (n == 0)
        digits = 1;
    else
        digits = countDigits(n < 0 ? -n : n);

    printf("Number of digits = %d", digits);

    return 0;
}
