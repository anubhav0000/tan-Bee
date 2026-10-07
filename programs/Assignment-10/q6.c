#include <stdio.h>

void addition()
{
    float a, b;

    printf("\nEnter two numbers: ");
    scanf("%f %f", &a, &b);

    printf("Addition = %.2f\n", a + b);
}

void subtraction()
{
    float a, b;

    printf("\nEnter two numbers: ");
    scanf("%f %f", &a, &b);

    printf("Subtraction = %.2f\n", a - b);
}

void multiplication()
{
    float a, b;

    printf("\nEnter two numbers: ");
    scanf("%f %f", &a, &b);

    printf("Multiplication = %.2f\n", a * b);
}

void division()
{
    float a, b;

    printf("\nEnter two numbers: ");
    scanf("%f %f", &a, &b);

    if (b != 0)
        printf("Division = %.2f\n", a / b);
    else
        printf("Division by zero is not possible.\n");
}

int main()
{
    int choice;

    printf("Simple Calculator\n");
    printf("-----------------\n");
    printf("1. Addition\n");
    printf("2. Subtraction\n");
    printf("3. Multiplication\n");
    printf("4. Division\n");

    printf("\nEnter your choice: ");
    scanf("%d", &choice);

    switch (choice)
    {
        case 1:
            addition();
            break;

        case 2:
            subtraction();
            break;

        case 3:
            multiplication();
            break;

        case 4:
            division();
            break;

        default:
            printf("Invalid choice.");
    }

    return 0;
}
