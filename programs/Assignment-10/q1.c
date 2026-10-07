#include <stdio.h>

void swap(float *a, float *b)
{
    float temp;

    temp = *a;
    *a = *b;
    *b = temp;
}

int main()
{
    float a, b;

    printf("Enter two float values: ");
    scanf("%f %f", &a, &b);

    printf("\nBefore swapping:");
    printf("\na = %.2f", a);
    printf("\nb = %.2f", b);

    swap(&a, &b);

    printf("\n\nAfter swapping:");
    printf("\na = %.2f", a);
    printf("\nb = %.2f", b);

    return 0;
}
