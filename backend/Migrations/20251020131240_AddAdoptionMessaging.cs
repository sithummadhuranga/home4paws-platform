using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Home4Paws.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAdoptionMessaging : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "adoption_messages",
                schema: "development",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    listing_id = table.Column<int>(type: "integer", nullable: false),
                    sender_id = table.Column<int>(type: "integer", nullable: false),
                    receiver_id = table.Column<int>(type: "integer", nullable: false),
                    message = table.Column<string>(type: "text", nullable: false),
                    is_read = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_adoption_messages", x => x.id);
                    table.ForeignKey(
                        name: "FK_adoption_messages_adoption_listings_listing_id",
                        column: x => x.listing_id,
                        principalSchema: "development",
                        principalTable: "adoption_listings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_adoption_messages_users_receiver_id",
                        column: x => x.receiver_id,
                        principalSchema: "development",
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_adoption_messages_users_sender_id",
                        column: x => x.sender_id,
                        principalSchema: "development",
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_adoption_messages_listing_id",
                schema: "development",
                table: "adoption_messages",
                column: "listing_id");

            migrationBuilder.CreateIndex(
                name: "IX_adoption_messages_receiver_id",
                schema: "development",
                table: "adoption_messages",
                column: "receiver_id");

            migrationBuilder.CreateIndex(
                name: "IX_adoption_messages_sender_id",
                schema: "development",
                table: "adoption_messages",
                column: "sender_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "adoption_messages",
                schema: "development");
        }
    }
}
